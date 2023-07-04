import {environment} from "../../environments/environment";

const {API} = environment;

const auth = `${API}auth`
const order = `${API}orders`
const users = `${API}users`
const groups = `${API}groups`
const comments = `${API}comments`

const urls = {
  auth: {
    login:`${auth}/login`,
    refresh:`${auth}/refresh-token`,
    me: `${API}auth/me`

  },
  order: {
    order:order,
    orderById: (id:number): string=>`${order}/${id}`,
    orderUserById: (userId:number):string => `${order}/user/${userId}`
  },
  users: {
    users,
    byID: (id: string) : string => `${users}/byID/${id}`,
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
