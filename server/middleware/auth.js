import { clerkClient, verifyToken } from "@clerk/clerk-sdk-node";

// Verifies the Clerk session token sent in the Authorization header
// and attaches the Clerk user id to req.auth
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: no token provided" });
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    req.auth = { userId: payload.sub };
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};

export { clerkClient };
