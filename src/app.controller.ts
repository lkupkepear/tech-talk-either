import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { AppService } from './app.service';
import { SignInError } from './password';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async create(@Body() login: LoginDTO) {
    const result = this.appService.signIn(login);
    const value = await result();
    return E.match(
      (e: SignInError) => {
        switch (e._tag) {
          case 'EmailValidationError':
            throw new HttpException(e.message, HttpStatus.FORBIDDEN);
          case 'PasswordMinLengthValidationError':
            throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
        }
      },
      (value) => value,
    )(value);

    // const x = this.appService.getResult(value);
    // return x;
  }
}
