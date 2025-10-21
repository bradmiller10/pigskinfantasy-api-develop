export { compare } from './compare';
export { encrypt } from './encrypt';
export { generateCode } from './generateCode';

/**
 * The amount of times bcrypt will run it's salting rounds. More rounds = more security at the cost of speed
 * so ten is a good middle ground for speed and security
 *
 * @author jordanskomer
 * @since 0.0.1
 */
export const saltRounds = 10;
