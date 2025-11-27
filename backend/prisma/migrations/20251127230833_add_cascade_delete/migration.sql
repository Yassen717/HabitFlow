-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Log" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "habitId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Log_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Log" ("completed", "date", "habitId", "id") SELECT "completed", "date", "habitId", "id" FROM "Log";
DROP TABLE "Log";
ALTER TABLE "new_Log" RENAME TO "Log";
CREATE INDEX "Log_habitId_idx" ON "Log"("habitId");
CREATE INDEX "Log_date_idx" ON "Log"("date");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
