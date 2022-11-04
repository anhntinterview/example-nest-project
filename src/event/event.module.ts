import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventGateway } from './event.gateway';
import { EventService } from './event.service';
import { EventEntity } from './entities/event.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthMiddleware } from 'src/users/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, EventEntity]), UsersModule],
  controllers: [EventController],
  providers: [EventService, EventGateway],
})
export class EventModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'events/feed', method: RequestMethod.GET },
        { path: 'events', method: RequestMethod.POST },
        { path: 'events/:id', method: RequestMethod.DELETE },
        { path: 'events/:id', method: RequestMethod.PUT },
      );
  }
}
