export interface IAuthLogin{
  email:string,
  password:string
}

export interface IAuth{
  email:string,
  password:string,
  role: {
    type:string,
    Enum: UserRole,
  },
  firstName: string,
  lastName: string,
  phone: string
}

enum UserRole {
  Admin = 'ADMIN',
  Manager = 'MANAGER'
}
