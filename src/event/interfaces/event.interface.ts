import { EventEntity } from '../entities/event.entity';

export interface EventRO {
  event: EventEntity;
}

export interface EventsRO {
  list: EventEntity[];
  count: number;
}
