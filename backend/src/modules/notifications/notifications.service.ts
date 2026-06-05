import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendEmail(to: string, subject: string, body: string) {
    // TODO: integrate SendGrid
    this.logger.log(`📧 Email to ${to}: ${subject}`);
  }

  async sendSms(to: string, message: string) {
    // TODO: integrate Twilio
    this.logger.log(`📱 SMS to ${to}: ${message}`);
  }

  async sendPush(userId: string, title: string, body: string) {
    // TODO: integrate Firebase FCM
    this.logger.log(`🔔 Push to ${userId}: ${title}`);
  }
}
