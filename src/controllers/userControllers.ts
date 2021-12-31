import { RequestHandler } from "express";
import createHttpError, { InternalServerError } from "http-errors";
import User from "../model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../config";

export const signupUser: RequestHandler = async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(createHttpError(422, "Email Already Exist!"));

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ name, email, password: hashedPassword, phone });

    await user.save();

    res.json({ message: "User Created" });
  } catch (error) {
    return next(InternalServerError);
  }
};

export const signinUser: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(createHttpError(404, "User not Found!"));

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return next(createHttpError(401, "Not Valid Password!"));

    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        userId: user.id,
      },
      JWT_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token);

    res.json({ name: user.name, token });
  } catch (error) {
    return next(InternalServerError);
  }
};

export const logoutUser: RequestHandler = async (req, res, next) => {
  try {
    await res.cookie("jwt", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.json({ message: "User logout" });
  } catch (error) {
    return next(InternalServerError);
  }
}

export const getAllUser: RequestHandler = async (req, res, next) => {
  try {
    
    const users = await User.find();

    res.json({ user: users });
  } catch (error) {
    return next(InternalServerError);
  }
};

export const getUserByName: RequestHandler =async (req, res, next) => {
    try {
      let regex = new RegExp(req.params.name, 'i');
      const user = await User.find({name: regex});
      res.json({ user: user });
    } catch (error) {
      return next(InternalServerError);
    }
}
