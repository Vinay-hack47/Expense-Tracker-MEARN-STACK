// import { Group } from "../models/group.model.js";
// import jwt from "jsonwebtoken";

// export const createGroup = async (req, res) => {
//   try {
//     const { name, members } = req.body;

//     const createdBy = req.id;

//      const memberList = [
//       { userId: createdBy, role: "admin" },
//       ...members.map((id) => ({ userId: id, role: "member" })),
//     ];

//     const group = await Group.create({name, members: memberList, createdBy});
//     return res.status(201).json({ message: "Group created successfully", group });

//     // const group = await Group.create({
//     //   name: name,
//     //   members: [{ userId : userId, role: "admin" }, ...members],
//     //   createdBy: userId,
//     // });

//     // const groupTokenData = {
//     //   groupId : group._id,
//     // }

//     // const groupToken = await jwt.sign(groupTokenData, process.env.SECRET_KEY, {expiresIn:"1D"});

//     // return res.status(201).cookie("groupToken" , groupToken, {maxAge:1*24*60*60*1000, httpOnly:true, sameSite:"strict"}).json({ msg: "Group created successfully", success: true, group });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Failed to create group", success: false });
//   }
// };

// export const addMember = async (req, res) => {
//   try {
//     const { groupId, memberId } = req.body;

//     const group = await Group.findById(groupId);
//     if (!group) return res.status(404).json({ msg: "Group not found", success: false });

//     // Check if the user is an admin
//     const isAdmin = group.members.some(
//       (member) => member.userId.toString() === req.id && member.role === "admin"
//     );
//     if (!isAdmin) return res.status(403).json({ msg: "Only admins can add members", success: false });

//     // Add the new member
//     group.members.push({ userId: memberId, role: "member" });
//     await group.save();

//     return res.status(200).json({ msg: "Member added successfully", success: true, group });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Failed to add member", success: false });
//   }
// };

// export const getGroups = async (req, res) => {
//   try {
//     const userId = req.id;

//     const groups = await Group.find({ "members.userId": userId });

//     return res.status(200).json({ msg: "Groups fetched successfully", success: true, groups });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Failed to fetch groups", success: false });
//   }
// };

import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ msg: "Group name is required", success: false });
    }
    const userId = req.id;

    const group = await Group.create({
      name,
      createdBy: userId,
      members: [{ userId, role: "admin" }],
    });
    // .populate("members.userId")

    res.status(201).json({ success: true, msg: "Group created", group });
  } catch (err) {
    // res.status(500).json({ success: false, msg: err.message });
    console.log(err);
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const userId = req.id;

    const groups = await Group.find({ "members.userId": userId }).populate(
      "members.userId",
      "fullname email"
    );

    res.status(200).json({ success: true, groups });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

export const getSingleGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate("members.userId");
    res.status(200).json({ success: true, group });
  } catch (error) {
    res.status(500).json({ msg: error.message, success: false });
  }
};

export const addMemberToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isAlreadyMember = group.members.find((m) =>
      m.userId.equals(user._id)
    );
    if (isAlreadyMember)
      return res.status(400).json({ msg: "User already in group" });

    group.members.push({ userId: user._id, role: "member" });
    await group.save();
    const updatedGroup = await Group.findById(groupId).populate(
      "members.userId"
    );

    res
      .status(200)
      .json({ msg: "Member added successfully", success: true, updatedGroup });
  } catch (err) {
    res.status(500).json({ msg: err.message, success: false });
  }
};

// export const removeMemberFromGroup = async (req, res) => {
//   try {
//     const { groupId, memberId } = req.params;
//     if(!groupId || !memberId){
//       return res.status(400).json({ msg: "GroupId and MemberId is required" });
//     }

//     const group = await Group.findById(groupId);
//     if (!group) return res.status(404).json({ msg: "Group not found" });

//     group.members = group.members.filter(
//       (m) => m.userId.toString() !== memberId
//     );
//     await group.save();

//     res.status(200).json({ msg: "Member removed", success: true });
//   } catch (err) {
//     res.status(500).json({ msg: err.message, success: false });
//   }
// };

export const removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;

    if (!groupId || !memberId) {
      return res.status(400).json({ msg: "GroupId and MemberId are required" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ msg: "Group not found" });
    }

    const memberExists = group.members.some(
      (m) => m.userId.toString() === memberId
    );

    if (!memberExists) {
      return res.status(404).json({ msg: "Member not found in group" });
    }

    group.members = group.members.filter(
      (m) => m.userId.toString() !== memberId
    );

    await group.save();
    const updatedGroup = await Group.findById(groupId).populate(
      "members.userId"
    );

    res
      .status(200)
      .json({ msg: "Member removed", success: true, updatedGroup });
  } catch (err) {
    res.status(500).json({ msg: err.message, success: false });
  }
};
