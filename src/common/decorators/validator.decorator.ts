import { applyDecorators } from '@nestjs/common'
import * as _ from 'lodash'
import { IsString, MaxLength, Matches, IsEmail } from 'class-validator'

export function IsStringField({
  maxLength = 100,
  match = /^[-\sa-zA-Z ]+$/,
  matchMessage = '', // Match message for exception
}) {
  return applyDecorators(
    IsString(),
    MaxLength(maxLength),
    Matches(match, _.pickBy({ message: matchMessage })) as ClassDecorator,
  )
}

export function IsStringWithPunctuation() {
  return applyDecorators(
    IsString(),
    MaxLength(300),
    Matches(/^[a-zA-Z0-9,.!?]*$/) as ClassDecorator,
  )
}

export function IsNotPersonalEmail() {
  return applyDecorators(
    IsEmail(),
    MaxLength(100),
    Matches(/^((?!@(yahoo|ymail|rocketmail|gmail|hotmail|outlook)\.).)*$/, {
      message: 'Please enter a work email address',
    }) as ClassDecorator,
  )
}
