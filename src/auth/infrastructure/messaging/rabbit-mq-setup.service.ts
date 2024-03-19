import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { connect } from 'amqplib';

@Injectable()
export class RabbitMQSetupService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQSetupService.name);

  async onModuleInit() {
    await this.connectToRabbitMQ();
  }

  private async connectToRabbitMQ() {
    const user = process.env.RABBITMQ_USERNAME || 'guest';
    const pass = process.env.RABBITMQ_PASSWORD || 'guest';
    const vhost = process.env.RABBITMQ_VHOST || '/';
    const exchangeName = process.env.RABBITMQ_EXCHANGE_NAME || 'user_events';
    const queueName = process.env.RABBITMQ_QUEUE_NAME || 'user_creation_queue';
    const routingKey = process.env.RABBITMQ_ROUTING_KEY || 'user.created';
    const host = process.env.RABBITMQ_HOST || 'rabbitmq';
    const port = process.env.RABBITMQ_PORT || 5672;
    const connectionUri = `amqp://${user}:${pass}@${host}:${port}${vhost}`;
    let retryAttempts = 10;

    while (retryAttempts > 0) {
      try {
        const connection = await connect(connectionUri);
        const channel = await connection.createChannel();

        await channel.assertExchange(exchangeName, 'topic', { durable: true });
        const queueAssertion = await channel.assertQueue(queueName, {
          durable: true,
        });
        await channel.bindQueue(queueAssertion.queue, exchangeName, routingKey);
        this.logger.log(
          'Exchange and Queue configured successfully with the provided values.',
        );

        return;
      } catch (error) {
        this.logger.error(
          `Error configuring Exchange and Queue: ${error.message}`,
        );
        retryAttempts--;

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    this.logger.error(
      'Failed to configure RabbitMQ after maximum retry attempts.',
    );
  }
}
