import express from "express";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password)
      return res
        .status(400)
        .json({ msg: "All fields are required", success: false });

    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ msg: "Email already exists", success: false });
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname: fullname,
      email: email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ msg: "User Created Successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ msg: "All fields are required", success: false });

    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ msg: "Invalid Password", success: false });
    } else {
      return res.status(400).json({ msg: "User not found", success: false });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1D",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ msg: `Welcome back ${user.fullname}`, success: true , user});
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", {maxAge:0}).json({msg: "User logout Successfully" , success:true})
  } catch (error) {
    console.log(error);
  }
};