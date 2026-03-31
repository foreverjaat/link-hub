const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, underscores"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    fullName: {
      type: String,
      default: "",
      maxlength: [80, "Full name cannot exceed 80 characters"],
    },
    MobileNumber: {
      type: String,
      default: "",
      match: [/^\d{10}$/, 'Mobile must be 10 digits'],
    },
    displayName: {
      type: String,
      default: "",
      maxlength: [50, "Display name cannot exceed 50 characters"],
    },
    bio: {
      type: String,
      default: "",
      maxlength: [160, "Bio cannot exceed 160 characters"],
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      enum: ["default", "dark", "purple", "ocean"],
      default: "default",
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving — Mongoose 7+ async hooks must NOT use next()
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
