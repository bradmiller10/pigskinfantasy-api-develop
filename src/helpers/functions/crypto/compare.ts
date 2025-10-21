import { compare as c } from 'bcrypt';

/**
 * Determines if the passed in plainText matches the passed in hash or not
 *
 * @param plainText - The plain text to compare
 * @param hash - The hash to compare
 * @returns true if it matches, false if not
 * @author jordanskomer
 * @since 0.0.1
 */
export const compare = async (
  plainText: string,
  hash: string,
): Promise<boolean> => await c(plainText, hash);
