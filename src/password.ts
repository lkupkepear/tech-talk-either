export class MinLengthValidationError extends Error {
  public _tag: 'PasswordMinLengthValidationError';

  public minLength: number;
  public stack: string | undefined;

  private constructor(minLength: number) {
    super(`password fails to meet min length requirement: ${minLength}`);
    this._tag = 'PasswordMinLengthValidationError';
    this.stack = new Error().stack;
    this.minLength = minLength;
  }

  public static of(minLength: number): MinLengthValidationError {
    return new MinLengthValidationError(minLength);
  }
}

export class CapitalLetterMissingValidationError extends Error {
  public _tag: 'PasswordCapitalLetterMissingValidationError';

  private constructor() {
    super(`password is missing a capital letter`);
    this._tag = 'PasswordCapitalLetterMissingValidationError';
  }

  public static of(): CapitalLetterMissingValidationError {
    return new CapitalLetterMissingValidationError();
  }
}

export class EmailValidationError extends Error {
  public _tag: 'EmailValidationError';

  private constructor() {
    super(`email is failing because`);
    this._tag = 'EmailValidationError';
  }

  public static of(): EmailValidationError {
    return new EmailValidationError();
  }
}

export type PasswordValidationError =
  | MinLengthValidationError
  | CapitalLetterMissingValidationError;

export type SignInError = EmailValidationError | MinLengthValidationError;
