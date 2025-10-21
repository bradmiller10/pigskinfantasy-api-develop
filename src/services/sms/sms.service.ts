import { Injectable, Logger } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly client: SNSClient;
  constructor() {
    this.client = new SNSClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
  }

  /**
   * Sends a text message via AWS SNS to the passed in phone number.
   *
   * @note When in development we only output the message to the console log to save on costs
   * @param Message
   * @param PhoneNumber
   * @returns True if it was a success, false if we encountered an error
   * @author jordanskomer
   */
  send(Message: string, PhoneNumber: string): boolean {
    try {
      if (process.env.ENV === 'local') {
        this.logger.log(`Would send "${Message}" to ${PhoneNumber}`);
        return true;
      }

      this.logger.verbose(`Sending "${Message}" to ${PhoneNumber} via AWS SNS`);
      this.client.send(
        new PublishCommand({
          Message,
          PhoneNumber,
        }),
      );
    } catch (e) {
      this.logger.error(`Encountered error sending "${Message}" to ${PhoneNumber} - ${e.message}`);
      return false;
    }
  }

  verify(phoneNumber: number): boolean {
    return true;
  }
}
