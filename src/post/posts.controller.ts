import {
  Get,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Param,
  Controller,
  Patch,
} from '@nestjs/common';
import { Request } from 'express';
import { ArticleService } from './posts.service';
import { CreateArticleDto } from './dto/create-post.dto';
import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { ArticlesRO, ArticleRO } from './interfaces/post.interface';
import { CommentsRO } from '../comment/interfaces/comment.interface';
import { User } from '../users/user.decorator';
import { ReactionDTOType } from "../reaction/dto/create-reaction.dto";

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateReactionDto } from 'src/reaction/dto/create-reaction.dto';
import { UpdateReactionDto } from 'src/reaction/dto/update-reaction.dto';

// @ApiBearerAuth()
@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Return all articles.' })
  @Get()
  async findAll(@Query() query): Promise<ArticlesRO> {
    console.log(`query ---`, query);
    
    return await this.articleService.findAll(query);
  }

  //   @ApiOperation({ summary: 'Get article feed' })
  //   @ApiResponse({ status: 200, description: 'Return article feed.' })
  //   @ApiResponse({ status: 403, description: 'Forbidden.' })
  //   @Get('feed')
  //   async getFeed(
  //     @User('id') userId: number,
  //     @Query() query,
  //   ): Promise<ArticlesRO> {
  //     return await this.articleService.findFeed(userId, query);
  //   }

  // @Get(':slug')
  // async findOne(@Param('slug') slug): Promise<ArticleRO> {
  //   return await this.articleService.findOne({ slug });
  // }

  @Get(':id')
  async findOne(@Param('id') id): Promise<ArticleRO> {
    return await this.articleService.findOne({ id });
  }

  @Get(':slug/comments')
  async findComments(@Param('slug') slug): Promise<CommentsRO> {
    return await this.articleService.findComments(slug);
  }

  @ApiOperation({ summary: 'Create article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(
    @User('id') userId: number,
    @Body('article') articleData: CreateArticleDto,
  ) {
    console.log(`----------`, articleData);
    console.log(`----------`, userId);
    return this.articleService.create(userId, articleData);
  }

  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Patch(':id')
  async updatePatch(
    @Param() params,
    @Body('article') articleData: CreateArticleDto,
  ) {
    // Todo: update slug also when title gets changed
    return this.articleService.updatePatch(params.id, articleData);
  }

  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':slug')
  async update(
    @Param() params,
    @Body('article') articleData: CreateArticleDto,
  ) {
    // Todo: update slug also when title gets changed
    return this.articleService.update(params.slug, articleData);
  }

  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug')
  async delete(@Param() params) {
    return this.articleService.delete(params.slug);
  }

  @ApiOperation({ summary: 'Create comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/comments')
  async createComment(
    @Param('slug') slug,
    @Body('comment') commentData: CreateCommentDto,
  ) {
    return await this.articleService.addComment(slug, commentData);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/comments/:id')
  async deleteComment(@Param() params) {
    const { slug, id } = params;
    return await this.articleService.deleteComment(slug, id);
  }

  @ApiOperation({ summary: 'Create reaction' })
  @ApiResponse({
    status: 201,
    description: 'The reaction has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/reaction')
  async createReaction(
    @Param('slug') slug,
    @Body('reaction') reactionData: CreateReactionDto,
  ) {
    return await this.articleService.addReaction(slug, reactionData);
  }

  // @ApiOperation({ summary: 'Update reaction' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'The reaction has been successfully updated.',
  // })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  // @Patch(':slug/reaction')
  // async updateReaction(
  //   @Param('slug') slug,
  //   @Body('reaction') reactionData: UpdateReactionDto,
  // ) {
  //   return await this.articleService.updateReaction(slug, reactionData);
  // }

  @ApiOperation({ summary: 'Update reaction' })
  @ApiResponse({
    status: 201,
    description: 'The reaction has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Patch(':slug/single-reaction')
  async updateSingleReactionName(
    @Param('slug') slug,
    @Body('reaction') reactionKey: string,
  ) {
    return await this.articleService.updateSingleReaction(slug, reactionKey);
  }

  @ApiOperation({ summary: 'Favorite article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully favorited.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/favorite')
  async favorite(@User('id') userId: number, @Param('slug') slug) {
    return await this.articleService.favorite(userId, slug);
  }

  @ApiOperation({ summary: 'Unfavorite article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully unfavorited.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/favorite')
  async unFavorite(@User('id') userId: number, @Param('slug') slug) {
    return await this.articleService.unFavorite(userId, slug);
  }
}
