const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Link = require("../models/Link");



router.get("/:username", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const links = await Link.find({ user: user._id, isActive: true }).sort({ order: 1 });

    res.json({
      success: true,
      profile: {
        username: user.username,
        displayName: user.fullName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        theme: user.theme,
        links: links.map((l) => ({
          id: l._id,
          title: l.title,
          url: l.url,
          icon: l.icon,
          clicks: l.clicks,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
