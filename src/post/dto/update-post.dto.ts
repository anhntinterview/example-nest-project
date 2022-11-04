import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto, CreateReactionArticleDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreateArticleDto) {}

export class UpdateReactionArticleDto extends PartialType(
  CreateReactionArticleDto,
) {}
