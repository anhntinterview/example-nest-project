import { UserData } from '../../users/interfaces/user.interface';
import { ReactionData } from '../../reaction/interfaces/reaction.interface';
import { ArticleEntity } from '../entities/post.entity';

export interface ArticleData {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  favorited?: boolean;
  favoritesCount?: number;
  reaction?: ReactionData;
  author?: UserData;
}

export interface ArticleRO {
  article: ArticleEntity;
}

export interface ArticlesRO {
  list: ArticleEntity[];
  count: number;
}
