import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import RefreshToken from "../models/refreshToken.js";
import { generateTokens } from "../utils/generateTokens.js";

const router = express.Router();

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ error: "Credenziali errate" });

  const tokens = await generateTokens(user);
  res.json(tokens);
});

/* REFRESH TOKEN */
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(401);

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const exists = await RefreshToken.findOne({ token: refreshToken });
    if (!exists) return res.sendStatus(403);

    await RefreshToken.deleteOne({ token: refreshToken });

    const user = await User.findById(payload.id);
    const tokens = await generateTokens(user);

    res.json(tokens);
  } catch {
    res.sendStatus(403);
  }
});

/* LOGOUT */
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  await RefreshToken.deleteOne({ token: refreshToken });
  res.sendStatus(204);
});

export default router;
