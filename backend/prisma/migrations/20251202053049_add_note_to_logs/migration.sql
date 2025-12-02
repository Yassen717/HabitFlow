-- AlterTable
ALTER TABLE "Log" ADD COLUMN "note" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "pointsReward" INTEGER NOT NULL DEFAULT 0,
    "criteria" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'trophy',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Achievement" ("category", "createdAt", "criteria", "description", "icon", "id", "key", "name", "pointsReward", "tier") SELECT "category", "createdAt", "criteria", "description", "icon", "id", "key", "name", "pointsReward", "tier" FROM "Achievement";
DROP TABLE "Achievement";
ALTER TABLE "new_Achievement" RENAME TO "Achievement";
CREATE UNIQUE INDEX "Achievement_key_key" ON "Achievement"("key");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
