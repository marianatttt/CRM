export interface IComment {
  text:string;
  orderId:number;
  id:number | null;
  createdAt: Date;

  author: string;


  // author: {
  //   firstName: string;
  //
  //   lastName: string;
  // };


}


