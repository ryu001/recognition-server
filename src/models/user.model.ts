import { RowDataPacket } from 'mysql2'

export interface User extends RowDataPacket{
  id: number
  loginId: string,
  userName: string,
  userMail: string,
  userRole: number,
  avatarUrl: string
}

export interface UserPoint extends RowDataPacket{
  recognitionUserId: number
  userPoint: number
}

export interface LoginInfo {
  loginId: string
  password: string
}
