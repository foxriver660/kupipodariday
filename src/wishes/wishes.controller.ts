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
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto);
  }
  @Post(':id/copy')
  createCopy(@Param('id') id: string, @Body() createWishDto: CreateWishDto) {
    console.log('post wishes/:id/copy', createWishDto, `id: ${id}`);
    return this.wishesService.createCopy(createWishDto);
  }

  @Get('last')
  findLast() {
    console.log('get wishes/last');
    return this.wishesService.findLast();
  }
  @Get('top')
  findTop() {
    console.log('get wishes/top');
    return this.wishesService.findTop();
  }
  @Get(':id')
  findById(@Param('id') id: string) {
    console.log('get wishes/:id', `id: ${id}`);
    return this.wishesService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    console.log('patch wishes/:id', updateWishDto, `id: ${id}`);
    return this.wishesService.update(+id, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('delete wishes/:id', `id: ${id}`);
    return this.wishesService.remove(+id);
  }
}
