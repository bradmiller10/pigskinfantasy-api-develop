import { DateTime } from 'luxon';

/**
 * Generates a secure 6 digit one time code to be used for passwordless authentication
 *
 * @returns
 * @author jordanskomer
 * @since 0.0.1
 */
export const generateCode = (length = 6): string =>
  DateTime.now()
    .valueOf()
    .toString()
    .slice(-1 * length);
