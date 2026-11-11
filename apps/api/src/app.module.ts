import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environmentValidationSchema } from './config/environment';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      validationSchema: environmentValidationSchema,
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
      },
    }),
    HealthModule,
  ],
})
export class AppModule {}
