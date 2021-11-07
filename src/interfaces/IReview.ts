import mongoose from "mongoose";
import { ILocation } from "./ILocation";
import { IUserReviewDTO, IUser } from "./IUser";

export interface IReview {
  user: IUserReviewDTO & mongoose.Document<any, any>;
  locationId: number;
  title: string;
  content: string;
  emoji: string;
  category: string;
  created_at: Date;
}

export interface IReviewOutputDTO {
  _id: string;
  locationName: string;
  locationId: number;
  nickname: IWriterDTO;
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
  locationId: number;
  emoji: string;
  title: string;
  content: string;
  create_at: Date;
}
