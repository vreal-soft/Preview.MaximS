import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiTags } from '@nestjs/swagger'
import { User } from './entities/user.entity'
import { AuthGuard } from 'common/guards/auth.guard'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll({})
  }

  @UseGuards(AuthGuard)
  @Get('info')
  async getUserInfo(@Req() { user: { id } }): Promise<User> {
    return await this.usersService.findOne({ where: { id } })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id: +id })
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update({ id: +id }, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete({ id: +id })
  }
}