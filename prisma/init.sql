-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "langue" TEXT NOT NULL,
    "niveau" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Compte" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "description" TEXT,
    "photo_profil" TEXT,
    "id_utilisateur" INTEGER NOT NULL,
    CONSTRAINT "Compte_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Statistiques" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "coursTermines" INTEGER NOT NULL DEFAULT 0,
    "id_utilisateur" INTEGER NOT NULL,
    CONSTRAINT "Statistiques_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cours" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "langue" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProgressionCours" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "termine" BOOLEAN NOT NULL DEFAULT false,
    "id_utilisateur" INTEGER NOT NULL,
    "id_cours" INTEGER NOT NULL,
    CONSTRAINT "ProgressionCours_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProgressionCours_id_cours_fkey" FOREIGN KEY ("id_cours") REFERENCES "Cours" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Discussion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sujet" TEXT NOT NULL,
    "duree" INTEGER NOT NULL,
    "niveau" TEXT NOT NULL,
    "transcription" TEXT NOT NULL,
    "observations" TEXT NOT NULL,
    "score" INTEGER,
    "dateCreation" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_utilisateur" INTEGER NOT NULL,
    CONSTRAINT "Discussion_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Compte_email_key" ON "Compte"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Compte_id_utilisateur_key" ON "Compte"("id_utilisateur");

-- CreateIndex
CREATE UNIQUE INDEX "Statistiques_id_utilisateur_key" ON "Statistiques"("id_utilisateur");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressionCours_id_utilisateur_id_cours_key" ON "ProgressionCours"("id_utilisateur", "id_cours");
