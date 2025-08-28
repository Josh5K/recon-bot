const rateLimitWindowMs = 60 * 60 * 1000;
const maxRequestsPerUser = 15;

const userTimestamps = {};

export function isRateLimited(userId) {
    const now = Date.now();
    if (!userTimestamps[userId]) {
        userTimestamps[userId] = [];
    }
    userTimestamps[userId] = userTimestamps[userId].filter(ts => now - ts < rateLimitWindowMs);

    if (userTimestamps[userId].length >= maxRequestsPerUser) {
        return true;
    }
    userTimestamps[userId].push(now);
    return false;
}

