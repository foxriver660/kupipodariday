import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Body() createWishDto: CreateWishDto) {
    console.log('post wishes');
    return this.wishesService.create(createWishDto);
  }
  @Post(':id/copy')
  createCopy(@Param('id') id: string, @Body() createWishDto: CreateWishDto) {
    console.log('post wishes/:id/copy');
    return this.wishesService.create(createWishDto);
  }

  @Get('last')
  findLast() {
    console.log('get wishes/last');
    return this.wishesService.findAll();
  }
  @Get('top')
  findTop() {
    console.log('get wishes/top');
    return this.wishesService.findAll();
  }
  @Get(':id')
  findById(@Param('id') id: string) {
    console.log('get wishes/:id');
    return this.wishesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    console.log('patch wishes/:id', updateWishDto);
    return this.wishesService.update(+id, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('delete wishes/:id');
    return this.wishesService.remove(+id);
  }
}
