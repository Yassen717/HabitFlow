import { prisma } from './prisma';
import logger from './logger';

// Define all achievements with their criteria
export interface AchievementDefinition {
    key: string;
    name: string;
    description: string;
    category: 'streak' | 'habits' | 'points' | 'consistency';
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    pointsReward: number;
    icon: string;
    checkCriteria: (data: UserAchievementData) => boolean;
}

export interface UserAchievementData {
    userId: string;
    currentStreak: number;
    totalHabits: number;
    totalPoints: number;
    totalCompletions: number;
}

// Achievement definitions
export const ACHIEVEMENTS: AchievementDefinition[] = [
    // Streak Achievements
    {
        key: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        category: 'streak',
        tier: 'bronze',
        pointsReward: 50,
        icon: '🔥',
        checkCriteria: (data) => data.currentStreak >= 7,
    },
    {
        key: 'month_master',
        name: 'Month Master',
        description: 'Maintain a 30-day streak',
        category: 'streak',
        tier: 'silver',
        pointsReward: 100,
        icon: '🔥',
        checkCriteria: (data) => data.currentStreak >= 30,
    },
    {
        key: 'quarter_champion',
        name: 'Quarter Champion',
        description: 'Maintain a 90-day streak',
        category: 'streak',
        tier: 'gold',
        pointsReward: 200,
        icon: '🔥',
        checkCriteria: (data) => data.currentStreak >= 90,
    },
    {
        key: 'year_legend',
        name: 'Year Legend',
        description: 'Maintain a 365-day streak',
        category: 'streak',
        tier: 'platinum',
        pointsReward: 500,
        icon: '🔥',
        checkCriteria: (data) => data.currentStreak >= 365,
    },

    // Habit Creation Achievements
    {
        key: 'first_habit',
        name: 'First Habit',
        description: 'Create your first habit',
        category: 'habits',
        tier: 'bronze',
        pointsReward: 50,
        icon: '🌱',
        checkCriteria: (data) => data.totalHabits >= 1,
    },
    {
        key: 'habit_builder',
        name: 'Habit Builder',
        description: 'Create 5 habits',
        category: 'habits',
        tier: 'silver',
        pointsReward: 100,
        icon: '🌱',
        checkCriteria: (data) => data.totalHabits >= 5,
    },
    {
        key: 'habit_architect',
        name: 'Habit Architect',
        description: 'Create 10 habits',
        category: 'habits',
        tier: 'gold',
        pointsReward: 200,
        icon: '🌱',
        checkCriteria: (data) => data.totalHabits >= 10,
    },
    {
        key: 'habit_master',
        name: 'Habit Master',
        description: 'Create 25 habits',
        category: 'habits',
        tier: 'platinum',
        pointsReward: 500,
        icon: '🌱',
        checkCriteria: (data) => data.totalHabits >= 25,
    },

    // Points Achievements
    {
        key: 'point_starter',
        name: 'Point Starter',
        description: 'Earn 100 points',
        category: 'points',
        tier: 'bronze',
        pointsReward: 50,
        icon: '⭐',
        checkCriteria: (data) => data.totalPoints >= 100,
    },
    {
        key: 'point_collector',
        name: 'Point Collector',
        description: 'Earn 500 points',
        category: 'points',
        tier: 'silver',
        pointsReward: 100,
        icon: '⭐',
        checkCriteria: (data) => data.totalPoints >= 500,
    },
    {
        key: 'point_hoarder',
        name: 'Point Hoarder',
        description: 'Earn 1000 points',
        category: 'points',
        tier: 'gold',
        pointsReward: 200,
        icon: '⭐',
        checkCriteria: (data) => data.totalPoints >= 1000,
    },
    {
        key: 'point_legend',
        name: 'Point Legend',
        description: 'Earn 5000 points',
        category: 'points',
        tier: 'platinum',
        pointsReward: 500,
        icon: '⭐',
        checkCriteria: (data) => data.totalPoints >= 5000,
    },

    // Consistency Achievements
    {
        key: 'consistency_starter',
        name: 'Consistency Starter',
        description: 'Complete 10 habit check-ins',
        category: 'consistency',
        tier: 'bronze',
        pointsReward: 50,
        icon: '✅',
        checkCriteria: (data) => data.totalCompletions >= 10,
    },
    {
        key: 'consistency_builder',
        name: 'Consistency Builder',
        description: 'Complete 50 habit check-ins',
        category: 'consistency',
        tier: 'silver',
        pointsReward: 100,
        icon: '✅',
        checkCriteria: (data) => data.totalCompletions >= 50,
    },
    {
        key: 'consistency_pro',
        name: 'Consistency Pro',
        description: 'Complete 100 habit check-ins',
        category: 'consistency',
        tier: 'gold',
        pointsReward: 200,
        icon: '✅',
        checkCriteria: (data) => data.totalCompletions >= 100,
    },
    {
        key: 'consistency_legend',
        name: 'Consistency Legend',
        description: 'Complete 365 habit check-ins',
        category: 'consistency',
        tier: 'platinum',
        pointsReward: 500,
        icon: '✅',
        checkCriteria: (data) => data.totalCompletions >= 365,
    },
];

/**
 * Seed achievements into the database
 */
export const seedAchievements = async () => {
    try {
        for (const achievement of ACHIEVEMENTS) {
            await prisma.achievement.upsert({
                where: { key: achievement.key },
                update: {
                    name: achievement.name,
                    description: achievement.description,
                    category: achievement.category,
                    tier: achievement.tier,
                    pointsReward: achievement.pointsReward,
                    icon: achievement.icon,
                    criteria: JSON.stringify({
                        // Store any additional criteria data here if needed
                    }),
                },
                create: {
                    key: achievement.key,
                    name: achievement.name,
                    description: achievement.description,
                    category: achievement.category,
                    tier: achievement.tier,
                    pointsReward: achievement.pointsReward,
                    icon: achievement.icon,
                    criteria: JSON.stringify({}),
                },
            });
        }
        logger.info('Achievements seeded successfully');
    } catch (error) {
        logger.error('Error seeding achievements:', error);
        throw error;
    }
};

/**
 * Check which achievements a user has unlocked and return newly unlocked ones
 */
export const checkAchievements = async (
    userId: string,
    data: Partial<UserAchievementData>
): Promise<Array<{ achievement: any; pointsAwarded: number }>> => {
    try {
        // Get user's current achievements
        const userAchievements = await prisma.userAchievement.findMany({
            where: { userId },
            select: { achievementKey: true },
        });

        const unlockedKeys = new Set(userAchievements.map((ua) => ua.achievementKey));

        // Get user data needed for checking achievements
        const [user, habits, logs] = await Promise.all([
            prisma.user.findUnique({ where: { id: userId } }),
            prisma.habit.findMany({ where: { userId }, include: { logs: true } }),
            prisma.log.findMany({
                where: { habit: { userId } },
                orderBy: { date: 'desc' },
            }),
        ]);

        if (!user) return [];

        // Calculate current longest streak across all habits
        let maxStreak = 0;
        for (const habit of habits) {
            const streak = calculateStreak(habit.logs);
            if (streak > maxStreak) maxStreak = streak;
        }

        // Build user achievement data
        const achievementData: UserAchievementData = {
            userId,
            currentStreak: data.currentStreak ?? maxStreak,
            totalHabits: data.totalHabits ?? habits.length,
            totalPoints: data.totalPoints ?? user.points,
            totalCompletions: data.totalCompletions ?? logs.length,
        };

        // Check which achievements to unlock
        const newlyUnlocked: Array<{ achievement: any; pointsAwarded: number }> = [];

        for (const achievement of ACHIEVEMENTS) {
            // Skip if already unlocked
            if (unlockedKeys.has(achievement.key)) continue;

            // Check if criteria is met
            if (achievement.checkCriteria(achievementData)) {
                // Unlock the achievement
                const dbAchievement = await prisma.achievement.findUnique({
                    where: { key: achievement.key },
                });

                if (dbAchievement) {
                    await prisma.userAchievement.create({
                        data: {
                            userId,
                            achievementKey: achievement.key,
                        },
                    });

                    // Award points
                    await prisma.user.update({
                        where: { id: userId },
                        data: { points: { increment: achievement.pointsReward } },
                    });

                    newlyUnlocked.push({
                        achievement: {
                            ...dbAchievement,
                            icon: achievement.icon,
                        },
                        pointsAwarded: achievement.pointsReward,
                    });

                    logger.info(`Achievement unlocked: ${achievement.key} for user ${userId}`);
                }
            }
        }

        return newlyUnlocked;
    } catch (error) {
        logger.error('Error checking achievements:', error);
        return [];
    }
};

// Helper function to calculate streak (same logic as in habit controller)
const calculateStreak = (logs: Array<{ date: Date | string }>): number => {
    if (logs.length === 0) return 0;

    const sortedLogs = logs
        .map((log) => new Date(log.date))
        .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastLogDate = new Date(sortedLogs[0]);
    lastLogDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - lastLogDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 1) return 0;

    let expectedDate = new Date(lastLogDate);
    for (const logDate of sortedLogs) {
        const currentDate = new Date(logDate);
        currentDate.setHours(0, 0, 0, 0);

        if (currentDate.getTime() === expectedDate.getTime()) {
            streak++;
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else if (currentDate.getTime() < expectedDate.getTime()) {
            break;
        }
    }

    return streak;
};
