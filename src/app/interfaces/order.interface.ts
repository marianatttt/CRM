import {IComment} from "./comment.interface";

export interface IOrder {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  course: string;
  course_format: string;
  course_type: string;
  status: string | null;
  sum: number | null;
  alreadyPaid: number | null;
  groupId: number | null;
  created_at: string;
  utm: string;
  msg: string;
  userId: number | null;
  comments: IComment[]
}
