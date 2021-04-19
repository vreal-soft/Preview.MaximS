import { Transform } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ name: 'ops_users' })
export class User {
  @Transform((id) => Number(id))
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string

  @Column({ type: 'varchar', name: 'first_name' })
  first_name: string

  @Column({ type: 'varchar', name: 'last_name' })
  last_name: string

  @Column({ type: 'longtext', name: 'avatar_url' })
  avatar_url: string

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date

  @CreateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date

  @Column({ type: 'varchar', name: 'login_provider' })
  login_provider: string

  @Column({ type: 'longtext', name: 'temp_secret_2fa' })
  temp_secret_2fa: string

  @Column({ type: 'boolean', name: 'enabled_2fa' })
  enabled_2fa: boolean
}