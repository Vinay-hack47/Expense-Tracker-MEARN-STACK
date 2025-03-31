import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
 fullname:{
  type:String,
  required:true
 },
 email:{
  type:String,
  required:true,
  unique:true
  },
  password:{
    type:String,
    required:true
  },
  defaultCurrency:{
    type:String,
    required:true,
    default:"USD"
  }
})

export const User = mongoose.model("User", userSchema);