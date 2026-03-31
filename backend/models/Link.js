const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Link title is required"],
      trim: true,
      maxlength: [60, "Title cannot exceed 60 characters"],
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
    },
    icon: {
      type: String,
      default: "🔗",
    },
    clicks: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-set order on creation
linkSchema.pre("save", async function () {
  if (this.isNew) {
    const count = await this.constructor.countDocuments({ user: this.user });
    this.order = count;
  }
});

module.exports = mongoose.model("Link", linkSchema);
