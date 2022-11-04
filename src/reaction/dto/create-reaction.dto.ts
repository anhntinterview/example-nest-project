export class CreateReactionDto {
  readonly thumbsUp: number;
  readonly hooray: number;
  readonly heart: number;
  readonly rocket: number;
  readonly eyes: number;
}

export type ReactionDTOType<Type> = {
  [Property in keyof Type]: number;
};