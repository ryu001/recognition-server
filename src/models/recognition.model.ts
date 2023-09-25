import { RowDataPacket } from 'mysql2'

export interface Recognition extends RowDataPacket {
  id: number
  recognitionUserId?: number
  createUserId?: number
  point?: number
  detail?: string
}

export interface Activity extends RowDataPacket{
  recognitionId: number
  recognitionUserName: string
  recognitionCreatedTime: string
  recognitionDetail: string
}