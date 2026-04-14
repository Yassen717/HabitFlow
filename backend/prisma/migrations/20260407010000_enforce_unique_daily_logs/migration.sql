-- Normalize existing logs to day precision and enforce one completion per habit per day.
UPDATE "Log"
SET "date" = date_trunc('day', "date");

WITH ranked AS (
    SELECT
        "id",
        ROW_NUMBER() OVER (
            PARTITION BY "habitId", "date"
            ORDER BY "id"
        ) AS row_num
    FROM "Log"
)
DELETE FROM "Log" l
USING ranked r
WHERE l."id" = r."id"
  AND r.row_num > 1;

CREATE UNIQUE INDEX IF NOT EXISTS "Log_habitId_date_key"
ON "Log"("habitId", "date");
