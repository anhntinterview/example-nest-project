import { ReactionEntity } from "../entities/reaction.entity";
import { ArticleData } from "../../post/interfaces/post.interface";

export interface ReactionData {
  thumbsUp: number;
  hooray: number;
  heart: number;
  rocket?: number;
  eyes?: number;
}

export interface ReactionRO {
  reaction: ReactionEntity;
}

export interface ReactionsRO {
  reactions: ReactionEntity[];
}