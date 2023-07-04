export interface IAuthLogin{
  email:string,
  password:string,
  firstName: string,
  lastName: string

}

export interface IAuth{
  id:string,
  userId:number,
  email:string,
  password:string,
  role: {
    type:string,
    Enum: UserRole,
  },
  firstName: string,
  lastName: string,
  phone: string,
  isActive:boolean,
  lastLogin: Date | null

}

enum UserRole {
  Admin = 'ADMIN',
  Manager = 'MANAGER'
}
