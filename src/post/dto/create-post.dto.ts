import { ReactionEntity } from "src/reaction/entities/reaction.entity";
import { ReactionData } from "../../reaction/interfaces/reaction.interface";

export class CreateArticleDto {
  readonly title: string;
  readonly description: string;
  readonly body: string;
  readonly tagList: string[];
  readonly reaction: ReactionEntity
}

export class CreateReactionArticleDto {
  readonly reaction: ReactionData
}
