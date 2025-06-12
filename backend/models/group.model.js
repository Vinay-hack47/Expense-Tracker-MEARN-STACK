// import mongoose from "mongoose";

// const groupSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   members: [
//     {
//       userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       role: { type: String, default: "member" }, // "admin" or "member"
//     },
//   ],
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   createdAt: { type: Date, default: Date.now },
// });

// export const Group = mongoose.model("Group", groupSchema);

// import mongoose from "mongoose";

// const memberSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   role: {
//     type: String,
//     enum: ["admin", "member"],
//     default: "member",
//   },
// });

// const groupSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   members: [memberSchema],
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export const Group = mongoose.model("Group", groupSchema);

import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: {
        type: String,
        enum: ["admin", "member"],
        default: "member",
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  defaultCurrency: {
    type: String,
    required: true,
    default: "USD", // or any other sensible default
  },
});

export const Group = mongoose.model("Group", groupSchema);
