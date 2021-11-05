import mongoose from "mongoose";

export interface ILocation {
  _id: string;
  name: string;
  img?: string;
  address: string;
  latitude: number;
  longitude: number;
  category?: string;
}

export interface ILocationGeoDTO {
  _id: string;
  latitude: number;
  longitude: number;
}

export interface ILocationSearchDTO {
  _id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  category: string;
}
