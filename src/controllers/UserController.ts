import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/UserService";
import Logger from "../utils/Logger";

export const register = async (
  req: Request,
  res: Response,
  next: (arg0: any) => void
): Promise<void> => {
  const { username, password } = req.body;
  try {
    const user = await registerUser(username, password);
    res.json(user);
  } catch (error: any) {
    Logger.error(error);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: (arg0: any) => void
): Promise<void> => {
  const { username, password } = req.body;
  try {
    const token = await loginUser(username, password);
    res.json({ token });
  } catch (error: any) {
    Logger.error(error);
    next(error);
  }
};
