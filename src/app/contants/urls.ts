import {environment} from "../../environments/environment";

const {API} = environment;

const auth = `${API}auth/login`
const order = `${API}order`
const users = `${API}user`

const urls = {
  auth: {
    login:auth
  },
  order: {
    order:order
  },
  users: {
    users,
    byEmail: (email: string): string => `${users}/${email}`
  }
}

export {
  urls
}
