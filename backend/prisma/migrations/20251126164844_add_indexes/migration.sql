-- CreateIndex
CREATE INDEX "Habit_userId_idx" ON "Habit"("userId");

-- CreateIndex
CREATE INDEX "Log_habitId_idx" ON "Log"("habitId");

-- CreateIndex
CREATE INDEX "Log_date_idx" ON "Log"("date");
