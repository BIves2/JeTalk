import prisma from "../config/db.js"

/**
 * Récupère les cours disponibles pour un utilisateur selon son niveau
 */
export const getAvailableLessons = async (req, res) => {
    try {
        const { id } = req.query
        
        // Récupérer les infos de l'utilisateur
        const user = await prisma.utilisateur.findUnique({
            where: { id: parseInt(id) }
        })

        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" })

        // Récupérer les cours qui correspondent à son niveau et sa langue cible
        const lessons = await prisma.cours.findMany({
            where: {
                niveau: user.niveau,
                langue: user.langue
            },
            include: {
                progressions: {
                    where: { id_utilisateur: user.id }
                }
            }
        })

        res.status(200).json(lessons)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erreur lors de la récupération des leçons" })
    }
}

/**
 * Marque une leçon comme terminée et met à jour les stats
 */
export const completeLesson = async (req, res) => {
    try {
        const { id_utilisateur, id_cours } = req.body

        // 1. Mettre à jour ou créer la progression
        await prisma.progressionCours.upsert({
            where: {
                id_utilisateur_id_cours: {
                    id_utilisateur: parseInt(id_utilisateur),
                    id_cours: parseInt(id_cours)
                }
            },
            update: { termine: true },
            create: {
                id_utilisateur: parseInt(id_utilisateur),
                id_cours: parseInt(id_cours),
                termine: true
            }
        })

        // 2. Mettre à jour les statistiques de l'utilisateur
        await prisma.statistiques.upsert({
            where: { id_utilisateur: parseInt(id_utilisateur) },
            update: {
                coursTermines: { increment: 1 },
                points: { increment: 10 }
            },
            create: {
                id_utilisateur: parseInt(id_utilisateur),
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
