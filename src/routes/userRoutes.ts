import { Router } from "express";
import {
  signinUser,
  signupUser,
  logoutUser,
  getAllUser,
  getUserByName
} from "../controllers/userControllers";
import { authChecker } from "../middleware/authChecker";
import {
  signupUserValidation,
  signinUserValidation
} from "../validation/userValidation/userValidation";

const router = Router();

router.post("/signup", signupUserValidation, signupUser);
router.post("/login", signinUserValidation, signinUser);
router.get("/logout", logoutUser);
router.get("/all-users", authChecker, getAllUser);
router.get("/search/:name", authChecker, getUserByName);

export default router;
