import { TOKEN_EXPIRE } from './constants';

export const INVALID_PASSWORD_REGEX_MESSAGE = `password must contain 1 uppercase and 1 special character an 1 digit`;

export const ONETIMECODE_SMS_TEXT = (code: string) =>
  `Your verification code is ${code}. It will expire after ${TOKEN_EXPIRE} minutes`;
