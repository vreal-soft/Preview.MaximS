import { IsString, IsUrl } from 'class-validator'

export class GithubDto {
  @IsString()
  code: string

  @IsString()
  redirect_url: string
}
