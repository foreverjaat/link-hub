const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const protect = require("../middleware/auth");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const formatUser = (u) => ({
  id: u._id,
  username: u.username,
  email: u.email,
  fullName: u.fullName,
  contactNumber: u.contactNumber,
  displayName: u.displayName,
  bio: u.bio,
  avatarUrl: u.avatarUrl,
  theme: u.theme,
  profileComplete: u.profileComplete,
});

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return false;
  }
  return true;
};

// register 
router.post(
  "/register",
  [
    body("username").trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res, next) => {
    try {
      if (!validate(req, res)) return;
      const { username, email, password } = req.body;

      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: existing.email === email ? "Email already in use" : "Username already taken",
        });
      }

      const user = await User.create({ username, email, password, displayName: username });
      res.status(201).json({ success: true, token: generateToken(user._id), user: formatUser(user) });
    } catch (err) { next(err); }
  }
);

// login 
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res, next) => {
    try {
      if (!validate(req, res)) return;
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
      res.json({ success: true, token: generateToken(user._id), user: formatUser(user) });
    } catch (err) { next(err); }
  }
);


router.get("/me", protect, (req, res) => {
  res.json({ success: true, user: formatUser(req.user) });
});

// complete-profile  (after registration) ──
router.put("/complete-profile", protect, async (req, res, next) => {
  try {
    const { fullName, contactNumber, bio, displayName } = req.body;
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: "Full name is required" });
    }
    if (!MobileNumber || !MobiletNumber.trim()) {
      return res.status(400).json({ success: false, message: "Contact number is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName: fullName.trim(), contactNumber: contactNumber.trim(), bio: bio || "", displayName: displayName || fullName.trim(), profileComplete: true },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user: formatUser(user) });
  } catch (err) { next(err); }
});

// profile 
router.put("/profile", protect, async (req, res, next) => {
  try {
    const { fullName, MobileNumber, bio, displayName, avatarUrl, theme } = req.body;
    const updates = {};
    if (fullName   !== undefined) updates.fullName      = fullName;
    if (MobileNumber !== undefined) updates.MobileNumber = MobileNumber;
    if (bio        !== undefined) updates.bio           = bio;
    if (displayName !== undefined) updates.displayName  = displayName;
    if (avatarUrl  !== undefined) updates.avatarUrl     = avatarUrl;
    if (theme      !== undefined) updates.theme         = theme;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user: formatUser(user) });
  } catch (err) { next(err); }
});

//change-username 
router.put("/change-username", protect, async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ success: false, message: "Username must be at least 3 characters" });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ success: false, message: "Username can only contain letters, numbers, underscores" });
    }

    const taken = await User.findOne({ username: username.trim(), _id: { $ne: req.user._id } });
    if (taken) {
      return res.status(409).json({ success: false, message: "That username is already taken" });
    }

    const user = await User.findByIdAndUpdate(req.user._id, { username: username.trim() }, { new: true });
    res.json({ success: true, user: formatUser(user) });
  } catch (err) { next(err); }
});

// change-password
router.put("/change-password", protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both fields are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id).select("+password");
    const match = await user.comparePassword(currentPassword);
    if (!match) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) { next(err); }
});

module.exports = router;
