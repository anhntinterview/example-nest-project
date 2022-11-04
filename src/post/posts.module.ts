import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ArticleController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/post.entity';
import { CommentEntity } from '../comment/entities/comment.entity';
import { ReactionEntity } from '../reaction/entities/reaction.entity';
import { UserEntity } from '../users/entities/user.entity';
// import { FollowsEntity } from '../profile/follows.entity';
import { ArticleService } from './posts.service';
import { AuthMiddleware } from '../users/auth.middleware';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      CommentEntity,
      ReactionEntity,
      UserEntity,
      // FollowsEntity
    ]),
    UsersModule,
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'articles/feed', method: RequestMethod.GET },
        { path: 'articles', method: RequestMethod.POST },
        { path: 'articles/:slug', method: RequestMethod.DELETE },
        { path: 'articles/:slug', method: RequestMethod.PUT },
        { path: 'articles/:slug/comments', method: RequestMethod.POST },
        { path: 'articles/:slug/comments/:id', method: RequestMethod.DELETE },
        { path: 'articles/:slug/reaction', method: RequestMethod.POST },
        { path: 'articles/:slug/single-reaction', method: RequestMethod.PATCH },
        { path: 'articles/:slug/favorite', method: RequestMethod.POST },
        { path: 'articles/:slug/favorite', method: RequestMethod.DELETE },
      );
  }
}
