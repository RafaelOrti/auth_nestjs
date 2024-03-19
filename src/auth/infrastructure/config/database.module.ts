import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const ormConfigFile = process.env.NODE_ENV === 'development' ? 'orm-dev.config' : 'orm-prod.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const { default: AppDataSource } = await import(`./${ormConfigFile}`);
        return {
          ...AppDataSource.options,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
