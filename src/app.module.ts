import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModule } from './menu/menu.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { RestaurantOwnershipModule } from './authorization/restaurant-ownership/restaurant-ownership.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ClientModule } from './client/client.module';
import { OwnerModule } from './owner/owner.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { RegistrationModule } from './registration/registration.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { CartModule } from './cart/cart.module';
import { RestaurantQueryModule } from './restaurant/restaraurant.query-module';
import { MenuQueryModule } from './menu/menu.query-module';
import { ReviewModule } from './review/review.module';
import { UploadsController } from './uploads/uploads.controller';
import { readFileSync } from 'node:fs';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath:
      //   process.env.NODE_ENV === 'test'
      //     ? '.env.test'
      //     : '.env.development.local',
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_PRIVATE_KEY'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        // ssl: true,
        ssl: {
          ca: readFileSync('/etc/ssl/certs/rds-global-bundle.pem', 'utf8'),
          rejectUnauthorized: true,
        },
        autoLoadEntities: true,
        synchronize: false,
        dropSchema: process.env.NODE_ENV === 'test',
      }),
      dataSourceFactory(options) {
        if (!options) {
          throw new Error('TypeORM options are missing');
        }
        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    MenuModule,
    AuthModule,
    RestaurantOwnershipModule,
    RestaurantModule,
    ClientModule,
    OwnerModule,
    UserModule,
    OrderModule,
    RegistrationModule,
    CartModule,
    RestaurantQueryModule,
    MenuQueryModule,
    ReviewModule,
    HealthModule,
  ],
  controllers: [UploadsController],
  providers: [],
})
export class AppModule {}
