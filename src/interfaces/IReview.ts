import mongoose from "mongoose";
import { IUserReviewDTO } from "./IUser";

export interface IReview {
  user: IUserReviewDTO & mongoose.Document<any, any>;
  locationName: string;
  locationAddress: string;
  title: string;
  content: string;
  emoji: string;
  category: [string];
  created_at: Date;
}

export interface IReviewOutputDTO {
  _id: string;
  user: string;
  nickname: string;
  title: string;
  content: string;
  emoji: string;
  created_at: Date;
}

export interface IWriterDTO {
  _id: string;
  nickname: string;
}

export interface IReviewMyOutputDTO {
  _id: string;
  locationName: string;
  emoji: string;
  title: string;
  content: string;
  create_at: Date;
}
