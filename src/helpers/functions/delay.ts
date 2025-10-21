/**
 * Runs a delay for the passed in amount of Seconds
 * @param amountInSeconds - The amount of seconds to delay for
 * @returns
 */
export const delay = (amountInSeconds = 2): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, amountInSeconds * 1000));
