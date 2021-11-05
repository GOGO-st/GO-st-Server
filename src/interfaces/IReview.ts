import mongoose from "mongoose";
import { ILocation } from "./ILocation";
import { IUserReviewDTO, IUser } from "./IUser";

export interface IReview {
  location: ILocation;
  user: IUserReviewDTO & mongoose.Document<any, any>;
  title: string;
  content: string;
  emoji: string;
  category: string;
  created_at: Date;
}

export interface IReviewOutputDTO {
  _id: string;
  locationId: string;
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
  locationId: string;
  emoji: string;
  title: string;
  content: string;
  create_at: Date;
}
