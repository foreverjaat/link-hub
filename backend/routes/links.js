const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Link = require("../models/Link");
const protect = require("../middleware/auth");


router.get("/", protect, async (req, res, next) => {
  try {
    const links = await Link.find({ user: req.user._id }).sort({ order: 1 });
    res.json({ success: true, links });
  } catch (error) {
    next(error);
  }
});


router.post(
  "/",
  protect,
  [
    body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 60 }).withMessage("Title too long"),
    body("url").trim().isURL({ require_protocol: true }).withMessage("Please enter a valid URL (include https://)"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { title, url, icon } = req.body;
      const link = await Link.create({ user: req.user._id, title, url, icon: icon || "🔗" });

      res.status(201).json({ success: true, link });
    } catch (error) {
      next(error);
    }
  }
);


router.put("/:id", protect, async (req, res, next) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, user: req.user._id });
    if (!link) {
      return res.status(404).json({ success: false, message: "Link not found" });
    }

    const { title, url, icon, isActive } = req.body;
    if (title !== undefined) link.title = title;
    if (url !== undefined) link.url = url;
    if (icon !== undefined) link.icon = icon;
    if (isActive !== undefined) link.isActive = isActive;

    await link.save();
    res.json({ success: true, link });
  } catch (error) {
    next(error);
  }
});


router.delete("/:id", protect, async (req, res, next) => {
  try {
    const link = await Link.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!link) {
      return res.status(404).json({ success: false, message: "Link not found" });
    }
    res.json({ success: true, message: "Link deleted successfully" });
  } catch (error) {
    next(error);
  }
});



router.post("/:id/click", async (req, res, next) => {
  try {
    await Link.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});



router.put("/reorder/save", protect, async (req, res, next) => {
  try {
    const { orderedIds } = req.body; // Array of link IDs in new order

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: "orderedIds must be an array" });
    }

    // Update each link's order in parallel
    const updates = orderedIds.map((id, index) =>
      Link.findOneAndUpdate({ _id: id, user: req.user._id }, { order: index })
    );
    await Promise.all(updates);

    res.json({ success: true, message: "Order saved" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
