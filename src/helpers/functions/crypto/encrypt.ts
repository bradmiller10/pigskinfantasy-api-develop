import { hash } from 'bcrypt';
import { saltRounds } from '.';

/**
 * Encrypts the passed in plain text and returns the hashed version used bcrypt
 *
 * @param plainText - The text to encrypt
 * @docs https://github.com/kelektiv/node.bcrypt.js#readme
 * @author jordanskomer
 * @since 0.0.1
 */
export const encrypt = async (plainText: string): Promise<string> =>
  await hash(plainText, saltRounds);
