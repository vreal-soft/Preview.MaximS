import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'personal_access_tokens' })
export class PersonalToken {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number

  @Column({ name: 'tokenable_id', type: 'bigint' })
  userId: number

  @Column()
  name: string

  @Column()
  token: string
}
