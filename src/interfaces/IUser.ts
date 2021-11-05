export interface IUser {
  email: string;
  nickname: string;
  school: string;
  created_at?: Date;
  deleted_at?: Date;
}

export interface IUserOutputDTO {
  email: string;
  nickname: string;
  school: string;
}

export interface IUserReviewDTO {
  _id: string;
  nickname: string;
}
