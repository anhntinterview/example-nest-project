import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
// import { HttpExceptionFilter } from './common/filter/http-exception.filter';
// import { RoleGuard } from './common/guard/roles.guard';
// import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { logger } from './common/logger/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CatsController } from './cats/cats.controller';
// import { CatsModule } from './cats/cats.module';
import { ArticleModule } from './post/posts.module';
import { UsersModule } from './users/users.module';
import { EventModule } from './event/event.module';
// import { CommentModule } from './comment/comment.module';
// import { ValidationPipe } from '../common/pipe/validation.pipe';
// Lưu ý rằng: ValidationPipe được build chỉ để lấy ví dụ. Nó đã có sẵn trong Nest
// import { LoggerMiddleware } from './common/logger/logger.middleware';
import { UserEntity } from './users/entities/user.entity';
import { ArticleEntity } from './post/entities/post.entity';
import { CommentEntity } from './comment/entities/comment.entity';
import { ReactionEntity } from './reaction/entities/reaction.entity';
import { EventEntity } from './event/entities/event.entity';

@Module({
  imports: [
    // CatsModule,
    EventModule,
    ArticleModule,
    UsersModule,
    // CommentModule,
    // TypeOrmModule.forRoot({
    //   type: 'mongodb',
    //   url: 'mongodb+srv://cluster0.9zbfe.mongodb.net/node-auth',
    //   username: 'anhnt',
    //   password: '221089abcdE%',
    //   entities: [UserEntity],
    //   synchronize: true,
    //   useNewUrlParser: true,
    //   logging: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '221089abcdE%',
      database: 'blogdb',
      entities: [
        UserEntity,
        ArticleEntity,
        CommentEntity,
        EventEntity,
        ReactionEntity,
      ],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // *** Apply DI for Exception Filter -> registed inside module
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter
    // }

    // *** Apply DI for Pipe -> registed inside module
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe,
    // },

    // *** Apply DI for Guard -> registed inside module
    // {
    //   provide: APP_GUARD,
    //   useClass: RoleGuard,
    // },

    // *** Apply DI for Interceptor -> registed inside module
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger);
    // .exclude(
    //   {
    //     path: 'cats/(.*)',
    //     method: RequestMethod.DELETE,
    //   },
    //   // 'cats',
    // )
    // .forRoutes(CatsController);
    // .forRoutes('cats')
  }
}
