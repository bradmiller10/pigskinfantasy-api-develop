import { isDefined } from 'class-validator';
import { phone, datatype } from 'faker';

export abstract class Seeds<T> {
  abstract amount: number;
  private userAmount: number;

  public async create(): Promise<T[]> {
    const seeds: T[] = [];
    for (let i = 0; i < this.runTotal; i++) {
      seeds.push(await this.generate());
    }

    return seeds;
  }

  /**
   * Generates a random phone number from faker in E.164 format
   *
   * @returns A random phone number in E.164 format
   * @author jordanskomer
   * @since 0.0.1
   */
  protected randomPhoneNumber(): string {
    return phone.phoneNumber('+1!##!######');
  }

  protected randomEnumValue<T>(e): T {
    const keys = Object.keys(e)
      .filter((key) => isNaN(Number(key)))
      .map((key) => e[key]);
    const value = keys[datatype.number(keys.length - 1)] as any;
    return value as T;
  }

  protected abstract generate(): Promise<T>;

  constructor(amount?: number) {
    this.userAmount = amount;
  }

  get runTotal(): number {
    return isDefined(this.userAmount) ? this.userAmount : this.amount;
  }
}
