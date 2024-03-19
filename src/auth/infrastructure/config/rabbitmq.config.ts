export const rabbitMQConfig = {
  exchanges: [
    {
      name: process.env.RABBITMQ_EXCHANGE_NAME || 'user_events_default',
      type: process.env.RABBITMQ_EXCHANGE_TYPE || 'direct',
    },
  ],
  uri: `amqp://${process.env.RABBITMQ_USERNAME || 'guest'}:${process.env.RABBITMQ_PASSWORD || 'guest'}@${process.env.RABBITMQ_HOST || 'rabbitmq'}:${process.env.RABBITMQ_PORT || '5672'}`,
  connectionInitOptions: { wait: false },
};
