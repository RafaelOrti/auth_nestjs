import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class RabbitMQPublisherService {
  private readonly logger = new Logger(RabbitMQPublisherService.name);
  private readonly exchangeName =
    process.env.RABBITMQ_EXCHANGE_NAME || 'user_events';
  private readonly routingKey =
    process.env.RABBITMQ_ROUTING_KEY || 'user.created';

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishUserCreated(email: string) {
    const message = {
      type: 'USER_CREATED',
      email,
    };

    try {
      await this.amqpConnection.publish(
        this.exchangeName,
        this.routingKey,
        message,
      );
      this.logger.log(
        `'USER_CREATED' message successfully published for ${email}`,
      );
    } catch (error) {
      this.logger.error(
        `Error publishing 'USER_CREATED' message for ${email}: ${error.message}`,
      );
    }
  }
}
