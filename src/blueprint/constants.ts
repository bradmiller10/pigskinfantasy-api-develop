/**
 * The minimum amount of characters for a valid user password
 *
 * @author jordanskomer
 */
export const PASSWORD_MINIMUM_LENGTH = 8;
/**
 * Ensures at least 1 uppercase letter, 1 special character, and 1 digit
 *
 * @author jordanskomer
 */
export const PASSWORD_VALIDATION_REGEX = /(?=.*[@!#$%^&*()])(?=.*[A-Z])(?=.*[0-9]).*/;
/**
 * The amount of milliseconds we set for our JWT Tokens to expire in
 *
 * @author jordanskomer
 */
export const TOKEN_EXPIRE = 5;
/**
 * The amount of time in milliseconds a user can be logged into the system before we
 * need to re login
 *
 * @author jordanskomer
 */
export const REFRESH_TOKEN_EXPIRE = 30;
/**
 * How many digits our authentication verification code shoulde be
 *
 * @author jordanskomer
 */
export const VERIFICATION_CODE_LENGTH = 6;
/**
 * The amount of wrong codes a user can enter before they are locked out
 */
export const AUTH_ATTEMPT_LIMIT = 5;
