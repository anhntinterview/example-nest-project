import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { CreateEventDto } from './dto';
import { UserEntity } from '../users/entities/user.entity';
import { EventEntity } from './entities/event.entity';
import { EventsRO, EventRO } from './interfaces/event.interface';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/notifcations',
})
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  private logger: Logger = new Logger('App Gateway');

  @WebSocketServer()
  server: Server;

  async generateRandomNotifications(query): Promise<EventsRO> {
    const qb = await getRepository(EventEntity)
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.author', 'author');

    qb.where('1 = 1');

    qb.orderBy('event.created', 'DESC');

    if ('author' in query) {
      const author = await this.userRepository.findOne({
        username: query.author,
      });
      qb.andWhere('event.authorId = :id', { id: author.id });
    }

    const count = await qb.getCount();
    const list = await qb.getMany();

    return { list, count };
  }

  async findOne(where): Promise<EventRO> {
    const event = await this.eventRepository.findOne(where);
    return { event };
  }

  async create(
    eventData: CreateEventDto,
  ): Promise<EventEntity> {
    let event = new EventEntity();
    event.message = eventData.message;
    event.read = eventData.read;
    event.isNew = eventData.isNew;

    const newEvent = await this.eventRepository.save(event);

    const author = await this.userRepository.findOne({
      where: { id: eventData.userId },
      relations: ['events'],
    });
    author.events.push(event);

    await this.userRepository.save(author);

    return newEvent;
  }

  async update(id: number, eventData: any): Promise<EventRO> {
    let toUpdate = await this.eventRepository.findOne({ id });
    let updated = Object.assign(toUpdate, eventData);
    const event = await this.eventRepository.save(updated);
    return { event };
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.eventRepository.delete({ id });
  }

  @SubscribeMessage('sendRandomNotifications')
  async sendRandomNotifications(
    // @MessageBody() data: string
  ) {
    // this.logger.log(`GET MESSAGE FROM CLIENT ---------------------- ${data}`);

    const qb = await getRepository(EventEntity)
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.author', 'author');
    const count = await qb.getCount();
    const list = await qb.getMany();
    
    this.server.emit('sendRandomNotifications', {
      type: 'NOTIFICATION',
      data: { list, count },
    });
  }
}
