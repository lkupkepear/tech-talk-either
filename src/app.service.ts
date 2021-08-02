import { Injectable } from '@nestjs/common';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import {
  EmailValidationError,
  MinLengthValidationError,
  SignInError,
} from './password';
import { match, when, __ } from 'ts-pattern';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  signIn(loginDTO: LoginDTO): TE.TaskEither<SignInError, string> {
    return this.authenticate2(loginDTO.email, loginDTO.password);
  }

  authenticate(
    email: string,
    password: string,
  ): TE.TaskEither<SignInError, string> {
    if (this.hasAtSign(email)) return TE.left(EmailValidationError.of());
    if (this.passwordLengthInvalid(password))
      return TE.left(MinLengthValidationError.of(6));
    return TE.right('Signed In');
  }

  authenticate2(
    email: string,
    password: string,
  ): TE.TaskEither<SignInError, string> {
    return match({ email, password })
      .with({ email: when(this.hasAtSign) }, () =>
        TE.left(EmailValidationError.of()),
      )
      .with({ password: when(this.passwordLengthInvalid) }, () =>
        TE.left(MinLengthValidationError.of(6)),
      )
      .otherwise(() => TE.right('Signed In'));
  }

  hasAtSign = (email: string) => !email.includes('@');
  passwordLengthInvalid = (password: string) => password.length < 6;

  getResult = (e: E.Either<Error, string>) =>
    E.fold(
      (_: Error) => _.message.toUpperCase(),
      (_: string) => _.toString(),
    )(e);
}
