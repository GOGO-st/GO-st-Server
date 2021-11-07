import mongoose from "mongoose";

export interface ILocation {
  _id: string;
  locationId: number;
  name: string;
  img?: string;
  address: string;
  latitude: number;
  longitude: number;
  category?: string;
}

export interface ILocationForReviewDTO {
  name: string;
  locationId: number;
}

export interface ILocationGeoDTO {
  _id: string;
  locationId: number;
  latitude: number;
  longitude: number;
}

export interface ILocationSearchDTO {
  _id: string;
  locationId: number;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  category: string;
}
