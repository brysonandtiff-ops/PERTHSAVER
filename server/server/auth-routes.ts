import type { Express } from "express";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import bcrypt from "bcrypt";

export function setupAuthRoutes(app: Express) {
  // Email/Password signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse({
        ...req.body,
        authProvider: "email",
      });

      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input" });
      }

      const existingUser = await storage.getUserByEmail(parsed.data.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const hashedPassword = parsed.data.password
        ? await bcrypt.hash(parsed.data.password, 10)
        : null;

      const user = await storage.createUser({
        ...parsed.data,
        password: hashedPassword,
      });

      req.session.userId = user.id;
      res.status(201).json({ user: { id: user.id, email: user.email } });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Email/Password login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || user.authProvider !== "email") {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password || "");
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ user: { id: user.id, email: user.email } });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // OAuth flow (Google, GitHub, Apple, etc.)
  app.get("/api/auth/oauth/:provider", async (req, res) => {
    const { provider } = req.params;

    // In production, you'd use Replit Auth or a library like passport-google-oauth20
    // For now, this is a placeholder that shows the OAuth flow
    const oauthUrls: Record<string, string> = {
      google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.CALLBACK_URL!)}/api/auth/oauth/callback&response_type=code&scope=openid%20email%20profile`,
      github: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.CALLBACK_URL!)}/api/auth/oauth/callback&scope=user:email`,
      apple: `https://appleid.apple.com/auth/authorize?client_id=${process.env.APPLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.CALLBACK_URL!)}/api/auth/oauth/callback&response_type=code`,
      microsoft: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.MICROSOFT_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.CALLBACK_URL!)}/api/auth/oauth/callback&response_type=code&scope=openid%20profile%20email`,
    };

    const url = oauthUrls[provider];
    if (!url) {
      return res.status(400).json({ error: "Unknown provider" });
    }

    res.redirect(url);
  });

  // OAuth callback
  app.get("/api/auth/oauth/callback", async (req, res) => {
    const { code, state } = req.query;

    // This would exchange the code for a token, fetch user info, and create/login the user
    // Implementation depends on the specific OAuth provider

    try {
      // Placeholder - in production, handle the OAuth flow properly
      res.redirect("/");
    } catch (error) {
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out" });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          authProvider: user.authProvider,
          location: user.location,
          household: user.household,
          income: user.income,
          onboardingCompleted: user.onboardingCompleted,
          preferences: user.preferences,
          totalSaved: user.totalSaved,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
