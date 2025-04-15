import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "recruiter"],
    default: "student",
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  profile: {
    type: new mongoose.Schema(
      {
        bio: { type: String },
        skills: [{ type: String }],
        study: { type: String },
        experience: [{ type: String }],
        location: { type: String },
      },
      { _id: false }
    ),
    required: true,
    default: () => ({}),
  },
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
