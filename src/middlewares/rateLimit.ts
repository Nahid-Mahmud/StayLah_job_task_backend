import rateLimit from 'express-rate-limit';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// 1. IP-based general rate limiting
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
  },
});

// 2. User-based rate limiting (Authenticated users)
export const userRateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) return next();

  // Simple implementation: Use a separate limiter or custom logic
  // For industry standard, we could use a Redis-based limiter here.
  // Using express-rate-limit with a custom key:
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500, // Authenticated users get more quota
    keyGenerator: (request) =>
      typeof request.user?.id === 'string'
        ? request.user.id
        : String(request.ip),
    message: {
      success: false,
      message: 'User rate limit exceeded.',
      statusCode: StatusCodes.TOO_MANY_REQUESTS,
    },
  })(req, res, next);
};

// 3. Abnormal traffic detection & blocking
// Simple logic: If an IP hits 404s too many times, block it temporarily
const trafficStats: Record<string, { count: number; lastHit: number }> = {};
const BLOCKED_IPS = new Set<string>();

export const abnormalTrafficDetector = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip as string;

  if (BLOCKED_IPS.has(ip)) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message:
        'Your IP has been temporarily blocked due to abnormal traffic patterns.',
    });
  }

  next();
};

export const trackAbnormalPattern = (ip: string) => {
  const now = Date.now();
  if (!trafficStats[ip]) {
    trafficStats[ip] = { count: 1, lastHit: now };
  } else {
    // Reset count if last hit was long ago
    if (now - trafficStats[ip].lastHit > 60000) {
      trafficStats[ip].count = 1;
    } else {
      trafficStats[ip].count++;
    }
    trafficStats[ip].lastHit = now;
  }

  if (trafficStats[ip].count > 50) {
    // e.g., 50 suspicious requests in a minute
    BLOCKED_IPS.add(ip);
    // Unblock after 1 hour
    setTimeout(() => BLOCKED_IPS.delete(ip), 3600000);
  }
};
