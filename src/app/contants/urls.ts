import {environment} from "../../environments/environment";

const {API} = environment;

const auth = `${API}auth/login`
const order = `${API}orders`
const users = `${API}user`
const groups = `${API}groups`
const comments = `${API}comments`

const urls = {
  auth: {
    login:auth,
    refresh:`${auth}/refresh-token`,
    me: `${auth}/me`

  },
  order: {
    order:order,
    orderById: (id:number): string=>`${order}/${id}`,
    orderUserById: (userId:number):string => `${order}/user/${userId}`
  },
  users: {
    users,
    byEmail: (email: string): string => `${users}/${email}`
  },
  groups:{
    groups
  },
  comments:{
    commentsById: (orderId:string): string => `${comments}/${orderId}`
  }
}

export {
  urls
}
