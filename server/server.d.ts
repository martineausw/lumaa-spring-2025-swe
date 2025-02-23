import { Request } from "express";
declare type User = {
  id: string;
  username: string;
  password: string;
};

declare type Task = {
  id: string;
  title: string;
  description: string | null;
  isComplete: boolean;
  userId: string;
};

declare type RefreshToken = {
  id: string;
};

declare interface IUserIdRequest extends Request {
  userId: string;
}
