import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Res,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OwnerInterceptor } from 'src/interceptor/owner.interceptor';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OwnerInterceptor)
  @Post()
  create(@Req() { user }, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(user, createWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OwnerInterceptor)
  @Post(':id/copy')
  createCopy(@Req() { user }, @Param('id') id: string) {
    return this.wishesService.createCopy(user, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('last')
  findLast() {
    return this.wishesService.findPopularWishes('DESC');
  }

  @UseGuards(JwtAuthGuard)
  @Get('top')
  findTop() {
    return this.wishesService.findPopularWishes('ASC');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.wishesService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    console.log('patch wishes/:id', updateWishDto, `id: ${id}`);
    return this.wishesService.update(+id, updateWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() { user }, @Param('id') id: string) {
    console.log('delete wishes/:id', `id: ${id}`);
    return this.wishesService.remove(user, +id);
  }
}
