import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { EntitySerive } from 'common/abstracts/entity-service.abstract'

@Injectable()
export class UsersService extends EntitySerive<User> {
  constructor(
    @InjectRepository(User)
    protected readonly _repository: Repository<User>,
  ) {
    super()
  }
}