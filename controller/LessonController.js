import prisma from "../config/db.js"

/**
 * Récupère les cours disponibles pour un utilisateur selon son niveau
 */
export const getAvailableLessons = async (req, res) => {
    try {
        const userId = req.user?.id
        
        if (!userId) {
            return res.status(401).json({ message: "Authentification requise" })
        }

        // Récupérer les infos de l'utilisateur
        const user = await prisma.utilisateur.findUnique({
            where: { id: parseInt(userId) }
        })

        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" })

        // Normalisation de la langue ('fr', 'french', 'francais' -> 'Français', 'en', 'english' -> 'Anglais')
        const rawLang = (user.langue || "").toLowerCase().trim()
        let normalizedLang = "Français"
        if (rawLang === "en" || rawLang === "english" || rawLang === "anglais") {
            normalizedLang = "Anglais"
        } else if (rawLang === "fr" || rawLang === "french" || rawLang === "francais" || rawLang === "français") {
            normalizedLang = "Français"
        }

        // Normalisation du niveau ('débutant' -> 'Amateur', 'intermédiaire' -> 'Intermediaire', etc.)
        const rawNiveau = (user.niveau || "").toLowerCase().trim()
        let normalizedNiveau = "Amateur"
        if (rawNiveau.includes("débutant") || rawNiveau.includes("debutant") || rawNiveau.includes("amateur")) {
            normalizedNiveau = "Amateur"
        } else if (rawNiveau.includes("interm")) {
            normalizedNiveau = "Intermediaire"
        } else if (rawNiveau.includes("avan")) {
            normalizedNiveau = "Avance"
        } else if (rawNiveau.includes("exp")) {
            normalizedNiveau = "Expert"
        }

        // 1. Chercher d'abord les cours correspondant à la langue et au niveau normalisés ou bruts
        let lessons = await prisma.cours.findMany({
            where: {
                OR: [
                    { langue: normalizedLang, niveau: normalizedNiveau },
                    { langue: user.langue, niveau: user.niveau }
                ]
            },
            include: {
                progressions: {
                    where: { id_utilisateur: user.id }
                }
            }
        })

        // 2. Si aucun cours pour ce niveau spécifique, retourner les cours de la même langue
        if (lessons.length === 0) {
            lessons = await prisma.cours.findMany({
                where: {
                    OR: [
                        { langue: normalizedLang },
                        { langue: user.langue }
                    ]
                },
                include: {
                    progressions: {
                        where: { id_utilisateur: user.id }
                    }
                }
            })
        }

        // 3. Si toujours aucun cours (fallback général), retourner tous les cours disponibles
        if (lessons.length === 0) {
            lessons = await prisma.cours.findMany({
                include: {
                    progressions: {
                        where: { id_utilisateur: user.id }
                    }
                }
            })
        }

        console.log(`[Message✅]: ${lessons.length} cours retourné(s) pour l'utilisateur #${user.id} (${user.nom}, Langue: ${user.langue} -> ${normalizedLang}, Niveau: ${user.niveau} -> ${normalizedNiveau})`)
        return res.status(200).json(lessons)
    } catch (error) {
        console.error("[Error🚨 getAvailableLessons]:", error)
        return res.status(500).json({ message: "Erreur lors de la récupération des leçons" })
    }
}

/**
 * Marque une leçon comme terminée et met à jour les stats
 */
export const completeLesson = async (req, res) => {
    try {
        const { id_cours } = req.body
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ message: "Authentification requise" })
        }
        if (!id_cours) {
            return res.status(400).json({ message: "Identifiant du cours requis" })
        }

        // 1. Mettre à jour ou créer la progression
        await prisma.progressionCours.upsert({
            where: {
                id_utilisateur_id_cours: {
                    id_utilisateur: userId,
                    id_cours: parseInt(id_cours)
                }
            },
            update: { termine: true },
            create: {
                id_utilisateur: userId,
                id_cours: parseInt(id_cours),
                termine: true
            }
        })

        // 2. Mettre à jour les statistiques de l'utilisateur
        await prisma.statistiques.upsert({
            where: { id_utilisateur: userId },
            update: {
                coursTermines: { increment: 1 },
                points: { increment: 10 }
            },
            create: {
                id_utilisateur: userId,
                coursTermines: 1,
                points: 10
            }
        })

        res.status(200).json({ message: "Leçon terminée avec succès" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erreur lors de la validation de la leçon" })
    }
}
