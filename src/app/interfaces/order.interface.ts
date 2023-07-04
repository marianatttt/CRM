import {IComment} from "./comment.interface";

export interface IOrder {

  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  course: {
    type:string;
    enum: ECourse
  }
  course_format: {
    type:string;
    enum: ECourseFormat
  }
  course_type: {
    type:string;
    enum:ECourseType
  };
  status: {
    type:string | null;
    enum: EStatus

  }
  sum: number | null;
  alreadyPaid: number | null;
  groupId: number | null;

  group: {
    type: string | null;
    id:string;
    name:string;

  }

  created_at: string;

  manager: {
   type: string | null
    id:number,
    firstName:string,
    lastName:string
  };
  utm: string;
  msg: string;
  userId: number | null;
  comments: IComment[];
  ownerId: number;
}



export enum ECourse {
  FS = 'FS',
  QACX = 'QACX',
  JCX = 'JCX',
  JSCX = 'JSCX',
  FE = 'FE',
  PCX = 'PCX',
}

export enum ECourseFormat {

  STATIC = 'static',
  ONLINE = 'online',
}

export enum ECourseType {
  PRO = 'pro',
  MINIMAL = 'minimal',
  PREMIUM = 'premium',
  INCUBATOR = 'incubator',
  VIP = 'vip',
}

export enum EStatus {
  IN_WORK = 'In work',
  NEW = 'New',
  AGREE = 'Agree',
  DISAGREE = 'Disagree',
  DUBBING = 'Dubbing',
}
