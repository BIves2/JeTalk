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

-- CreateIndex
CREATE UNIQUE INDEX "Compte_email_key" ON "Compte"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Compte_id_utilisateur_key" ON "Compte"("id_utilisateur");
