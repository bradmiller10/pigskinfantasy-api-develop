import { isPhoneNumber, registerDecorator, ValidationOptions } from 'class-validator';
import { UserRole } from 'src/typings';

const userNumberRoles = Object.keys(UserRole).filter((r) => !isNaN(Number(r)));
/**
 * Ensures the value is a valid username. In our case it will either match one of our test users
 * or be forced to be a valid phone number. We want to check the user role number first as technically those are
 * not a valid phone number so isPhoneNumber will fail for those specific users
 *
 * @param validationOptions
 * @returns
 */
export function IsUsername(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isUsername',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          // Ensure username isn't one of our four test users
          if (userNumberRoles.includes(value.substr(0, 1)) && /\d{1}0{9}/.test(value)) return true;

          return isPhoneNumber(value);
        },
      },
    });
  };
}
