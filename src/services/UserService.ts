import "dotenv/config";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Repository } from "typeorm";
import { Container } from "typedi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRepository: Repository<User> = AppDataSource.getRepository(User);

export const registerUser = async (
  username: string,
  password: string
): Promise<User> => {
  const user = await userRepository.findOneBy({ username });
  if (user) {
    const error = new Error("User with this username exists");
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = userRepository.create({ username, password: hashedPassword });
  return await userRepository.save(newUser);
};

export const loginUser = async (
  username: string,
  password: string
): Promise<string> => {
  const user = await userRepository.findOneBy({ username });
  if (!user) {
    throw new Error("User not found");
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    const error = new Error("Invalid password");
    throw error;
  }
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || "some-secret",
    { expiresIn: "1h" }
  );
  return token;
};
