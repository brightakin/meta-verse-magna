import { Router } from "express";
import { register, login } from "../controllers/UserController";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Repository } from "typeorm";
const { body } = require("express-validator");
const router = Router();
const userRepository: Repository<User> = AppDataSource.getRepository(User);
router.post(
  "/register",
  [
    body("username").trim().not().isEmpty(),
    body("password").trim().not().isEmpty(),
  ],
  register
);
router.post(
  "/login",
  [
    body("username").trim().not().isEmpty(),
    body("password").trim().not().isEmpty(),
  ],
  login
);

export default router;
