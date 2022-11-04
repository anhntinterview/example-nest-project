import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventGateway } from './event.gateway';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEventDto } from './dto';
import { EventService } from './event.service';
import { EventsRO, EventRO } from './interfaces/event.interface';
import { User } from '../users/user.decorator';

@ApiBearerAuth()
@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
  ) {}

  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ status: 200, description: 'Return all notifications.' })
  @Get()
  async findAll(@Query() query): Promise<EventsRO> {
    return await this.eventService.generateRandomNotifications(query);
  }

  @Get(':id')
  async findOne(@Param('id') id): Promise<EventRO> {
    return await this.eventService.findOne({ id });
  }

  @Get('message')
  // @Get(':message')
  async sendRandomNotification(
    // @Param('message') message
  ) {
    // console.log(`-------------`, message);
    
    return await this.eventService.sendRandomNotifications(
      // message
    );
  }

  @ApiOperation({ summary: 'Create event' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(
    // @User('id') userId: number, // Get current user by token
    @Body('event') eventData: CreateEventDto,
  ) {
    return this.eventService.create(eventData);
  }

  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':id')
  async update(@Param() params, @Body('event') eventData: CreateEventDto) {
    // Todo: update id also when title gets changed
    return this.eventService.update(params.id, eventData);
  }

  @ApiOperation({ summary: 'Delete event' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  async delete(@Param() params) {
    return this.eventService.delete(params.id);
  }
}
