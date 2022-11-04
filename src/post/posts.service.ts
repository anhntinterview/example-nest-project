import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { ArticleEntity } from './entities/post.entity';
import { CommentEntity } from '../comment/entities/comment.entity';
import { UserEntity } from '../users/entities/user.entity';
// import { FollowsEntity } from '../profile/follows.entity';
import { CreateArticleDto } from './dto/create-post.dto';

import { ArticleRO, ArticlesRO } from './interfaces/post.interface';
import { CommentsRO } from '../comment/interfaces/comment.interface';
import { ReactionEntity } from '../reaction/entities/reaction.entity';
import { ReactionRO } from '../reaction/interfaces/reaction.interface';
const slug = require('slug');

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(ReactionEntity)
    private readonly reactionRepository: Repository<ReactionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>, // @InjectRepository(FollowsEntity) // private readonly followsRepository: Repository<FollowsEntity>,
  ) {}

  async findAll(query): Promise<ArticlesRO> {
    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.reaction', 'reaction')

    qb.where('1 = 1');

    console.log(`query ===: `, query);

    if ('tag' in query) {
      qb.andWhere('article.tagList LIKE :tag', { tag: `%${query.tag}%` });
    }

    if ('author' in query) {
      const author = await this.userRepository.findOne({
        username: query.author,
      });
      qb.andWhere('article.authorId = :id', { id: author.id });
    }

    if ('favorited' in query) {
      const author = await this.userRepository.findOne({
        username: query.favorited,
      });
      const ids = author.favorites.map((el) => el.id);
      qb.andWhere('article.authorId IN (:ids)', { ids });
    }

    qb.orderBy('article.created', 'DESC');

    const count = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const list = await qb.getMany();

    return { list, count };
  }

  //   async findFeed(userId: number, query): Promise<ArticlesRO> {
  //     const _follows = await this.followsRepository.find({ followerId: userId });

  //     if (!(Array.isArray(_follows) && _follows.length > 0)) {
  //       return { articles: [], articlesCount: 0 };
  //     }

  //     const ids = _follows.map((el) => el.followingId);

  //     const qb = await getRepository(ArticleEntity)
  //       .createQueryBuilder('article')
  //       .where('article.authorId IN (:ids)', { ids });

  //     qb.orderBy('article.created', 'DESC');

  //     const articlesCount = await qb.getCount();

  //     if ('limit' in query) {
  //       qb.limit(query.limit);
  //     }

  //     if ('offset' in query) {
  //       qb.offset(query.offset);
  //     }

  //     const articles = await qb.getMany();

  //     return { articles, articlesCount };
  //   }

  async findOne(where): Promise<ArticleRO> {
    const article = await this.articleRepository.findOne(where);
    return { article };
  }

  async addComment(slug: string, commentData): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({ slug });

    const comment = new CommentEntity();
    comment.body = commentData.body;

    article.comments.push(comment);

    await this.commentRepository.save(comment);
    article = await this.articleRepository.save(article);
    return { article };
  }

  async deleteComment(slug: string, id: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({ slug });

    const comment = await this.commentRepository.findOne(id);
    const deleteIndex = article.comments.findIndex(
      (_comment) => _comment.id === comment.id,
    );

    if (deleteIndex >= 0) {
      const deleteComments = article.comments.splice(deleteIndex, 1);
      await this.commentRepository.delete(deleteComments[0].id);
      article = await this.articleRepository.save(article);
      return { article };
    } else {
      return { article };
    }
  }

  async addReaction(slug: string, reactionData): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({ slug });

    const _reaction = new ReactionEntity();
    _reaction.eyes = reactionData.eyes;
    _reaction.heart = reactionData.heart;
    _reaction.hooray = reactionData.hooray;
    _reaction.rocket = reactionData.rocket;
    _reaction.thumbsUp = reactionData.thumbsUp;

    article.reaction = _reaction;

    await this.reactionRepository.save(_reaction);
    article = await this.articleRepository.save(article);
    return { article };
  }

  // async updateReaction(slug: string, reactionData): Promise<ReactionRO> {
  //   let article = await this.articleRepository.findOne({ slug });
  //   let toUpdateReaction = await this.reactionRepository.findOne({
  //     id: article.reaction.id,
  //   });
  //   let updated = Object.assign(toUpdateReaction, reactionData);

  //   await this.reactionRepository.save(updated);
  //   return { reaction: updated };
  // }

  async updateSingleReaction(slug: string, reactionKey: string): Promise<ReactionRO> {
    let article = await this.articleRepository.findOne({ slug });
    let toUpdateReaction = await this.reactionRepository.findOne({
      id: article.reaction.id,
    });
    const reactionValue = toUpdateReaction[reactionKey] += 1
    const updateReaction = {...toUpdateReaction, [reactionKey]: reactionValue}

    let updated = Object.assign(toUpdateReaction, updateReaction);

    await this.reactionRepository.save(updated);
    return { reaction: updated };
  }


  async favorite(id: number, slug: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({ slug });
    const user = await this.userRepository.findOne(id);

    const isNewFavorite =
      user.favorites.findIndex((_article) => _article.id === article.id) < 0;
    if (isNewFavorite) {
      user.favorites.push(article);
      article.favoriteCount++;

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    return { article };
  }

  async unFavorite(id: number, slug: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({ slug });
    const user = await this.userRepository.findOne(id);

    const deleteIndex = user.favorites.findIndex(
      (_article) => _article.id === article.id,
    );

    if (deleteIndex >= 0) {
      user.favorites.splice(deleteIndex, 1);
      article.favoriteCount--;

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    return { article };
  }

  async findComments(slug: string): Promise<CommentsRO> {
    const article = await this.articleRepository.findOne({ slug });
    return { comments: article.comments };
  }

  async create(
    userId: number,
    articleData: CreateArticleDto,
  ): Promise<ArticleEntity> {
    let article = new ArticleEntity();
    article.title = articleData.title;
    article.description = articleData.description;
    article.slug = this.slugify(articleData.title);
    article.tagList = articleData.tagList || [];
    article.comments = [];
    article.reaction = articleData.reaction;

    const newArticle = await this.articleRepository.save(article);

    const author = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['articles'],
    });
    author.articles.push(article);

    await this.userRepository.save(author);

    return newArticle;
  }

  async update(slug: string, articleData: any): Promise<ArticleRO> {
    let toUpdate = await this.articleRepository.findOne({ slug: slug });
    let updated = Object.assign(toUpdate, articleData);
    const article = await this.articleRepository.save(updated);
    return { article };
  }

  async updatePatch(id: number, articleData: any): Promise<ArticleRO> {
    let toUpdate = await this.articleRepository.findOne({ id: id });
    let updated = Object.assign(toUpdate, articleData);
    const article = await this.articleRepository.save(updated);
    return { article };
  }

  async delete(slug: string): Promise<DeleteResult> {
    return await this.articleRepository.delete({ slug: slug });
  }

  slugify(title: string) {
    return (
      slug(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
