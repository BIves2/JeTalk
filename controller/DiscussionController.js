import prisma from "../config/db.js"
import axios from "axios"

/**
 * Analyse l'ensemble de la conversation avec l'API IA (Groq ou fallback)
 * et produit des observations globales sur la performance de l'utilisateur.
 */
export const analyzeDiscussion = async (req, res) => {
    try {
        const { subject, duration, niveau, langue, chatHistory } = req.body
        const isEnglish = (langue === "Anglais" || langue === "en" || langue === "English")
        const targetLanguageName = isEnglish ? "l'anglais" : "le français"

        if (!chatHistory || !Array.isArray(chatHistory) || chatHistory.length === 0) {
            return res.status(200).json({
                score: 70,
                fluency: isEnglish ? "Short conversation" : "Conversation courte",
                grammar: [isEnglish ? "No major errors detected" : "Aucune erreur majeure détectée"],
                vocabulary: [isEnglish ? "Keep practicing!" : "Continuez à pratiquer !"],
                observations: isEnglish 
                    ? "The conversation was short. Feel free to exchange more for a deeper analysis."
                    : "La conversation a été courte. N'hésitez pas à échanger davantage pour une analyse plus approfondie."
            })
        }

        const apiKey = process.env.GROQ_API

        if (apiKey) {
            const systemPrompt = `Tu es un expert en évaluation linguistique. 
Analyse l'ensemble de la conversation ci-dessous entre un étudiant pratiquant ${targetLanguageName} (niveau ${niveau}) et un assistant IA sur le sujet "${subject}".
Évalue la performance globale de l'utilisateur.

Réponds IMPÉRATIVEMENT au format JSON strict avec la structure exacte suivante (aucun texte en dehors du JSON) :
{
  "score": <nombre entier entre 0 et 100 représentant la note globale>,
  "fluency": "<évaluation en 2 phrases de la fluidité et l'aisance de l'utilisateur en ${targetLanguageName}>",
  "grammar": ["<observation ou correction grammaticale 1>", "<observation ou correction 2>"],
  "vocabulary": ["<suggestion de vocabulaire enrichi 1>", "<suggestion 2>"],
  "observations": "<résumé global des points forts et des axes d'amélioration en 3-4 phrases pour encourager l'apprenant>"
}`

            const conversationFormatted = chatHistory.map(m => `${m.role === 'user' ? 'Utilisateur' : 'IA'}: ${m.content}`).join('\n')

            try {
                const response = await axios.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    {
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: `Voici la conversation à analyser :\n${conversationFormatted}` }
                        ],
                        temperature: 0.5,
                        response_format: { type: "json_object" }
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${apiKey}`,
                            "Content-Type": "application/json"
                        },
                        timeout: 25000
                    }
                )

                const content = response.data.choices?.[0]?.message?.content
                if (content) {
                    const parsed = JSON.parse(content)
                    return res.status(200).json(parsed)
                }
            } catch (aiErr) {
                console.warn("[Warning⚠️ Groq analysis failed, using rule-based analysis]:", aiErr.message)
            }
        }

        // Fallback si pas de clé API ou échec
        const userMessagesCount = chatHistory.filter(m => m.role === 'user').length
        const totalWords = chatHistory.filter(m => m.role === 'user').reduce((acc, m) => acc + m.content.split(' ').length, 0)
        const calculatedScore = Math.min(95, Math.max(60, 65 + userMessagesCount * 5 + Math.floor(totalWords / 10)))

        const fallbackAnalysis = {
            score: calculatedScore,
            fluency: isEnglish
                ? `You exchanged ${userMessagesCount} message(s) during this session on "${subject}". Great speaking practice!`
                : `Vous avez échangé ${userMessagesCount} message(s) pendant cette session sur "${subject}". Bonne prise de parole !`,
            grammar: isEnglish
                ? [
                    "Correct overall sentence structure.",
                    "Pay attention to verb tenses and agreement."
                ]
                : [
                    "Utilisation correcte de la structure des phrases.",
                    "Pensez à bien accorder les verbes avec leurs sujets."
                ],
            vocabulary: isEnglish
                ? [
                    "Try using a wider variety of adjectives.",
                    "Enrich your vocabulary by reusing terms suggested by the AI."
                ]
                : [
                    "N'hésitez pas à varier vos adjectifs.",
                    "Enrichissez votre lexique en réutilisant les termes introduits par l'IA."
                ],
            observations: isEnglish
                ? `Great conversation session! You maintained the discussion on "${subject}". Keep practicing regularly to build confidence and fluency.`
                : `Excellente session d'échange ! Vous avez maintenu la conversation sur le sujet "${subject}". Continuez à pratiquer régulièrement pour gagner en aisance et en précision.`
        }

        return res.status(200).json(fallbackAnalysis)

    } catch (error) {
        console.error("[Error🚨 analyzeDiscussion]:", error)
        return res.status(500).json({ error: "Erreur lors de l'analyse de la conversation." })
    }
}

/**
 * Enregistre les informations de la conversation et ses analyses dans la base de données (SGBD)
 */
export const saveDiscussion = async (req, res) => {
    try {
        const { subject, duration, niveau, chatHistory, observations, score } = req.body

        // L'identifiant vient du token, jamais du corps de la requête.
        const finalUserId = req.user?.id

        if (!finalUserId) {
            return res.status(401).json({ error: "Authentification requise." })
        }

        const discussion = await prisma.discussion.create({
            data: {
                sujet: subject || "Discussion générale",
                duree: parseInt(duration) || 5,
                niveau: niveau || "Amateur",
                transcription: JSON.stringify(chatHistory || []),
                observations: typeof observations === 'string' ? observations : JSON.stringify(observations || {}),
                score: score ? parseInt(score) : 75,
                id_utilisateur: parseInt(finalUserId)
            }
        })

        // Mettre à jour les statistiques de l'utilisateur (+15 points pour avoir terminé une discussion)
        await prisma.statistiques.upsert({
            where: { id_utilisateur: parseInt(finalUserId) },
            update: {
                points: { increment: 15 }
            },
            create: {
                id_utilisateur: parseInt(finalUserId),
                points: 15,
                coursTermines: 0
            }
        })

        console.log(`[Message✅]: Discussion #${discussion.id} sauvegardée avec succès en BDD pour l'utilisateur ${finalUserId}`)

        return res.status(200).json({
            code: "DISCUSSION_SAVED",
            message: "Discussion et analyses stockées avec succès.",
            discussionId: discussion.id
        })
    } catch (error) {
        console.error("[Error🚨 saveDiscussion]:", error)
        return res.status(500).json({ error: "Erreur lors du stockage en base de données." })
    }
}
