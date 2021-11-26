import mongoose from "mongoose";
import { IReviewOutputDTO } from "./IReview";

export interface ILocation {
  _id: string;
  locationName: string;
  locationAddress: string;
  x: number;
  y: number;
  category?: string[];
  emoji: string[];
  review: [IReviewOutputDTO];
}

export interface ILocationForReviewDTO {
  name: string;
  locationId: number;
}

export interface ILocationGeoDTO {
  _id: string;
  locationName: string;
  locationAddress: string;
  x: number;
  y: number;
  emoji: string[];
  reviewCount: number;
}

export interface ILocationSearchDTO {
  _id: string;
  locationName: string;
  locationAddress: string;
  x: number;
  y: number;
  category: string[];
}
