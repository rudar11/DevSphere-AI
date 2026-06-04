

import userModel from "../models/user.models.js";
import * as userService from '../services/user.service.js'
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // is emty karke ek method hoti hai agar ek bhi error nhi hai toh ye true restun karti hai  agar ek bhi error hai toh false return karti hai


    return res.status(400).json({ errors: errors.array() });// agar errro empty nhi hai toh   jo bhi erro aa rhai hai usko express validator se nikalo or bhej doo

  }
  try {
    const user = await userService.createUser(req.body); //acha matlab email and password req.body me aa gye

    const token = await user.generateJWT()


    delete user._doc.password;    // delete user._doc.password ka matlab hai: “user object se password hata do, taaki frontend me na dikhe”.  Security ke liye → frontend ko password kabhi nahi bhejna chahiye.   Mongoose me actual data _doc ke andar hota hai.

    res.status(201).json({ user, token })
  } catch (error) {
    res.status(400).send(error.message);
  }
}


export const loginUserController = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
      return res.status(401).json({ errors: "invalid credentials" })
    }

    const isMatch = await user.isValidPassword(password)

    if (!isMatch) {
      return res.status(401).json({ errors: "invalid credentials" })
    }

    const token = await user.generateJWT()


    delete user._doc.password;

    res.status(200).json({ user, token })
  } catch (error) {
    res.status(400).send(error.message)
  }
}



export const profileController = async (req, res) => {

  console.log(req.user)
  res.status(200).json({ user: req.user })

}

export const logoutUserController = async (req, res) => {

  try { 
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    redisClient.set(token, 'logout', 'EX', 60 * 60 * 24); //token ko redis par store krva diya expire 24 hour me hoga token ab logout or blacklist hogya

    res.status(200).json({ message: "logout successfully" })

  } catch (error) {
    console.log(error)
    res.status(400).send(error.message)
  }

}


export const getAllUserController = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({
      email: req.user.email
    })

    const allUsers = await userService.getAllUser({ userId: loggedInUser._id });
    return res.status(200).json({ users: allUsers })
  } catch (error) {
    console.log(error)
    res.status(400).send(error.message)
  }


}  