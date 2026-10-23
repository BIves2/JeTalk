import { PrismaClient } from "@prisma/client"
import prisma from "./config/db.js"

async function main() {
  console.log("Démarrage du peuplement de la base de données...")

  // Vérifier s'il y a déjà des cours
  const existingCourses = await prisma.cours.findMany()
  const force = process.argv.includes("--force")
  if (existingCourses.length > 0) {
    if (!force) {
      console.log(`Des cours existent déjà (${existingCourses.length}). Seed ignoré.`)
      console.log("Utilisez `pnpm db:seed -- --force` pour les remplacer.")
      return
    }
    console.log("Suppression des anciens cours (--force)...")
    await prisma.progressionCours.deleteMany()
    await prisma.cours.deleteMany()
  }

  const courses = [
    {
      titre: "Présentations de base (Anglais)",
      description: "Apprenez à vous présenter poliment, saluer les autres et poser des questions simples en anglais.",
      contenu: `Leçon 1 : Se présenter en Anglais

1. Les salutations (Greetings):
- Hello! (Bonjour - général)
- Hi! (Salut - informel)
- Good morning (Bonjour - le matin)
- Good afternoon (Bonjour - l'après-midi)

2. Donner son nom (Introducing yourself):
- My name is... (Mon nom est...)
- I am... / I'm... (Je suis...)

Exemple : 
"Hello! My name is John. Nice to meet you!"

3. Poser des questions simples :
- What is your name? (Quel est ton nom ?)
- How are you? (Comment vas-tu ?)
- Where are you from? (D'où viens-tu ?)`,
      niveau: "Amateur",
      langue: "Anglais"
    },
    {
      titre: "La grammaire essentielle : Present Simple",
      description: "Maîtrisez le temps le plus utilisé en anglais pour parler de vos habitudes et routines quotidiennes.",
      contenu: `Leçon 2 : Le Present Simple

Le Present Simple est utilisé pour exprimer des vérités générales, des habitudes ou des actions répétées.

1. Structure de base :
Sujet + Verbe (infinitif sans "to")
*Attention : On ajoute un "-s" ou "-es" à la 3e personne du singulier (he, she, it).*

Exemples :
- I play football every Saturday. (Je joue au football tous les samedis.)
- She plays tennis on Sundays. (Elle joue au tennis les dimanches.)

2. La forme négative :
Sujet + do/does + not + Verbe
- I do not (don't) like coffee. (Je n'aime pas le café.)
- He does not (doesn't) eat meat. (Il ne mange pas de viande.)

3. La forme interrogative :
Do/Does + Sujet + Verbe ?
- Do you speak English? (Parles-tu anglais ?)
- Does he study French? (Étudie-t-il le français ?)`,
      niveau: "Amateur",
      langue: "Anglais"
    },
    {
      titre: "Introductions et Salutations en Français",
      description: "Apprenez à aborder quelqu'un en français, vous présenter formellement ou informellement.",
      contenu: `Leçon 1 : Saluer et se présenter en Français

1. Les salutations de base :
- Bonjour (Formel, utilisable toute la journée)
- Salut (Informel, entre amis ou famille)
- Bonsoir (À utiliser en fin de journée)

2. Se présenter :
- Je m'appelle... (My name is...)
- Je suis... (I am...)
- Enchanté(e) (Nice to meet you)

Exemple :
- "Bonjour ! Je m'appelle Marie, enchantée !"

3. Demander des nouvelles :
- Comment allez-vous ? (Formel / Pluriel)
- Comment ça va ? / Ça va ? (Informel)`,
      niveau: "Amateur",
      langue: "Français"
    },
    {
      titre: "Le Présent de l'Indicatif : Verbes du 1er Groupe",
      description: "Découvrez comment conjuguer les verbes réguliers se terminant par -er au présent en français.",
      contenu: `Leçon 2 : Les verbes en -ER au présent de l'indicatif

La majorité des verbes français se terminent par -ER (ex: parler, habiter, aimer). Ce sont des verbes réguliers.

1. Règle de conjugaison :
On enlève "-er" pour obtenir le radical, puis on ajoute les terminaisons suivantes :
- Je : -e
- Tu : -es
- Il / Elle / On : -e
- Nous : -ons
- Vous : -ez
- Ils / Elles : -ent

2. Exemple avec le verbe PARLER (to speak) :
- Je parle (I speak)
- Tu parles (You speak)
- Il/Elle parle (He/She speaks)
- Nous parlons (We speak)
- Vous parlez (You speak)
- Ils/Elles parlent (They speak)

Exemple : "Nous parlons français et anglais."`,
      niveau: "Amateur",
      langue: "Français"
    },
    {
      titre: "Les Nombres et Compter de 1 à 20 (Anglais)",
      description: "Apprenez les chiffres et nombres de base en anglais pour exprimer les prix, les âges et les quantités.",
      contenu: `Leçon 3 : Les nombres de 1 à 20 en Anglais

1. De 1 à 10 :
- 1 : One
- 2 : Two
- 3 : Three
- 4 : Four
- 5 : Five
- 6 : Six
- 7 : Seven
- 8 : Eight
- 9 : Nine
- 10 : Ten

2. De 11 à 20 :
- 11 : Eleven
- 12 : Twelve
- 13 : Thirteen
- 14 : Fourteen
- 15 : Fifteen
- 16 : Sixteen
- 17 : Seventeen
- 18 : Eighteen
- 19 : Nineteen
- 20 : Twenty

3. Exemples en contexte :
- "I have two brothers." (J'ai deux frères.)
- "She is fifteen years old." (Elle a 15 ans.)
- "How much is it? It is ten dollars." (Combien cela coûte-t-il ? C'est dix dollars.)`,
      niveau: "Amateur",
      langue: "Anglais"
    },
    {
      titre: "Compter de 1 à 20 en Français",
      description: "Apprenez à compter et utiliser les chiffres de 1 à 20 dans des situations du quotidien en français.",
      contenu: `Leçon 3 : Les nombres de 1 à 20 en Français

1. De 1 à 10 :
- 1 : Un
- 2 : Deux
- 3 : Trois
- 4 : Quatre
- 5 : Cinq
- 6 : Six
- 7 : Sept
- 8 : Huit
- 9 : Neuf
- 10 : Dix

2. De 11 à 20 :
- 11 : Onze
- 12 : Douze
- 13 : Treize
- 14 : Quatorze
- 15 : Quinze
- 16 : Seize
- 17 : Dix-sept
- 18 : Dix-huit
- 19 : Dix-neuf
- 20 : Vingt

3. Exemples d'usage :
- "J'ai deux chats."
- "Il est trois heures."
- "Cela fait vingt euros s'il vous plaît."`,
      niveau: "Amateur",
      langue: "Français"
    },
    {
      titre: "Commander au restaurant et au café (Anglais)",
      description: "Apprenez le vocabulaire et les tournures de phrases essentielles pour commander à manger et boire en anglais.",
      contenu: `Leçon 4 : Au restaurant et au café

1. Expressions clés :
- "I would like..." ou "I'd like..." (Je voudrais...)
- "Can I have... please?" (Puis-je avoir... s'il vous plaît ?)
- "A bottle of water, please." (Une bouteille d'eau, s'il vous plaît.)
- "How much is it?" (Combien ça coûte ?)
- "The bill, please." (L'addition, s'il vous plaît.)

2. Dialogue type :
Serveur : "Hello! Are you ready to order?" (Bonjour ! Êtes-vous prêt à commander ?)
Client : "Yes, I'd like a chicken sandwich and an orange juice, please." (Oui, je voudrais un sandwich au poulet et un jus d'orange, s'il vous plaît.)
Serveur : "Anything else?" (Autre chose ?)
Client : "No, thank you. Just the bill, please." (Non, merci. Juste l'addition, s'il vous plaît.)`,
      niveau: "Amateur",
      langue: "Anglais"
    },
    {
      titre: "Demander son chemin et s'orienter en Français",
      description: "Maîtrisez les indications spatiales et apprenez à demander poliment sa direction dans la ville.",
      contenu: `Leçon 4 : S'orienter dans la ville

1. Poser la question poliment :
- "Pardon monsieur/madame, où se trouve la gare ?"
- "Excusez-moi, pour aller au musée s'il vous plaît ?"
- "Est-ce que c'est loin d'ici ?"

2. Comprendre les indications :
- "Allez tout droit" (Go straight)
- "Tournez à droite" (Turn right)
- "Tournez à gauche" (Turn left)
- "C'est à côté de la pharmacie" (It's next to the pharmacy)
- "C'est en face de l'école" (It's opposite the school)

3. Exemple :
- "Prenez la première rue à droite, puis continuez tout droit sur deux cents mètres."`,
      niveau: "Amateur",
      langue: "Français"
    },
    {
      titre: "Parler de ses loisirs et de sa famille (Anglais)",
      description: "Développez votre vocabulaire pour parler des membres de votre famille et de vos activités préférées.",
      contenu: `Leçon 5 : Loisirs et famille

1. La famille (Family members) :
- Father / Mother (Père / Mère)
- Brother / Sister (Frère / Sœur)
- Son / Daughter (Fils / Fille)
- Parents (Parents)

2. Exprimer ses goûts et loisirs :
- "I like listening to music." (J'aime écouter de la musique.)
- "I love reading books." (J'adore lire des livres.)
- "I don't like watching television." (Je n'aime pas regarder la télévision.)
- "In my free time, I play video games." (Pendant mon temps libre, je joue aux jeux vidéo.)

3. Exemple de présentation :
"I have one sister. In my free time, I like playing football and reading novels."`,
      niveau: "Amateur",
      langue: "Anglais"
    }
  ]

  for (const course of courses) {
    const created = await prisma.cours.create({
      data: course
    })
    console.log(`[Créé] Cours : ${created.titre} (${created.langue})`)
  }

  console.log(`Base de données peuplée avec succès avec ${courses.length} cours !`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
