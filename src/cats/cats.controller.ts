// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   // HttpException,
//   // HttpStatus,
//   UseFilters,
//   ParseIntPipe,
//   ParseUUIDPipe,
//   HttpStatus,
//   UsePipes,
//   ValidationPipe,
//   UseGuards,
//   SetMetadata,
//   UseInterceptors,
// } from '@nestjs/common';
// import { HttpExceptionFilter } from '../common/filter/http-exception.filter';
// import { ForbiddenException } from '../common/exception/forbidden.exception';
// import { CatsService } from './cats.service';
// import { CreateCatDto } from './dto/create-cat.dto';
// import { UpdateCatDto } from './dto/update-cat.dto';
// // import { JoiValidationPipe } from '../common/pipe/joi-validation.pipe';
// import { ObjectSchema } from 'joi';
// import { RoleGuard } from '../common/guard/roles.guard';
// import { Roles } from '../common/decorator/roles.decorator';
// import {
//   LoggingInterceptor,
//   TransformInterceptor,
//   Respone,
// } from '../common/interceptor/logging.interceptor';
// import { User } from '../common/decorator/user.decorator';
// import { UserEntity } from '../cats/entities/user.entity';
// // import { ValidationPipe } from '../common/pipe/validation.pipe'; // Lưu ý rằng: ValidationPipe được build chỉ để lấy ví dụ. Nó đã có sẵn trong Nest

// @Controller('cats')
// // @UseFilters(HttpExceptionFilter) // enable DI with class instead of instance
// // @UseGuards(RoleGuard) // enable DI with class instead of instance
// // @UseInterceptors(LoggingInterceptor) // enable DI with class instead of instance
// // @UseInterceptors(new LoggingInterceptor()) // disable DI
// export class CatsController {
//   constructor(private readonly catsService: CatsService) {}

//   // @Post()
//   // @UseFilters(HttpExceptionFilter)
//   // async create(@Body() createCatDto: CreateCatDto) {
//   //   throw new ForbiddenException();

//   //   // this.catsService.create(createCatDto);
//   // }
//   // @Post()
//   // *** Đây chỉ là một ví dụ ở scope method level cách dùng validation như thế nào
//   // @UsePipes(new JoiValidationPipe(createCatSchema))
//   // async create(@Body() createCatDto: CreateCatDto) {
//   //   return this.catsService.create(createCatDto);
//   // }
//   // ---
//   // *** Trong thực tế, chúng ta sử dụng class-validation và class-transform như dưới đây
//   @Post()
//   // @UseGuards(RoleGuard) // enable DI with class instead of instance
//   // @SetMetadata('roles',['admin'])
//   // @Roles('admin')
//   async create(
//     @Body()
//     createCatDto: // @Body(new ValidationPipe()) // Comment ở đây nghĩa là đã khai báo bên main.ts hoặc app.module.ts.
//     CreateCatDto,
//   ) {
//     return this.catsService.create(createCatDto);
//   }

//   @Get()
//   // @UseInterceptors(TransformInterceptor)
//   async findAll(@Body() data: Respone<[]>) {
//     // throw new ForbiddenException();
//     // throw new HttpException({
//     //   status: HttpStatus.FORBIDDEN,
//     //   message: 'This is custome message∫'
//     // }, HttpStatus.FORBIDDEN);

//     return this.catsService.findAll(data);
//   }

//   @Get('/users')
//   async findAllUser() {
//     const userList = [
//       {
//         id: 1,
//         name: 'John',
//       },
//       {
//         id: 2,
//         name: 'Jane',
//       },
//       {
//         id: 3,
//         name: 'Janna',
//       },
//     ];
//     return userList;
//   }

//   // @Get('users')
//   // @Auth('admin')
//   // findAllUsers() {}

//   @Get(':id')
//   async findOne(
//     // *** Create new decorator
//     @User(new ValidationPipe({ validateCustomDecorators: true }))
//     user: UserEntity,
//     // ---
//     // @User('firstName')
//     // firstName: string
//     // ---
//     // user: UserEntity
//     // *** Using Param with pipes ParseInt * ParseUUID
//     // @Param(
//     //   'id',
//     //   new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
//     //   // 'uuid',
//     //   // new ParseUUIDPipe()
//     // )
//     // uuid: string

//     // *** Normal example
//     // id: number,
//   ) {
//     // *** Create new decorator
//     // console.log(`Hello ${firstName}`);
//     // *** ---
//     console.log(user);
//     // *** Using Param with pipes ParseInt * ParseUUID
//     // return this.catsService.findOne(uuid);

//     // *** Normal example
//     // return this.catsService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
//     return this.catsService.update(+id, updateCatDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.catsService.remove(+id);
//   }
// }
