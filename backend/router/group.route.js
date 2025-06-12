// import express from "express";
import { createGroup,  getMyGroups, addMemberToGroup, removeMemberFromGroup, getSingleGroup } from "../controllers/group.controllers.js";
import { createGroupExpense, getGroupExpenses } from "../controllers/groupExpense.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

// const router = express.Router();

// router.route("/create").post(isAuthenticated, createGroup);
// router.route("/addMember").post(isAuthenticated, addMember);
// router.route("/getGroups").get(isAuthenticated, getGroups);

// export default router;



import express from "express";
const router = express.Router();

//todo single group
router.post("/create", isAuthenticated, createGroup);
router.get("/my-groups", isAuthenticated, getMyGroups);
router.get("/:groupId", isAuthenticated, getSingleGroup);

//todo group route
router.post("/:groupId/add", isAuthenticated, addMemberToGroup);
router.delete("/:groupId/remove/:memberId", isAuthenticated, removeMemberFromGroup);
router.get("/expense/group/get/:groupId", getGroupExpenses);
router.post("/expense/group/create/:groupId", isAuthenticated,createGroupExpense);
export default router;
