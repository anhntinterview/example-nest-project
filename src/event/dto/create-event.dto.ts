export class CreateEventDto {
  readonly message: string;
  readonly read: boolean;
  readonly isNew: boolean;
  readonly userId?: number;
}
