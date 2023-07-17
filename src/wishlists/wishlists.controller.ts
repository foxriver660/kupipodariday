import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto) {
    console.log('post wishlists', createWishlistDto);
    return this.wishlistsService.create(createWishlistDto);
  }

  @Get()
  findAll() {
    console.log('get wishlists');
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    console.log('get wishlists/:id', `id: ${id}`);
    return this.wishlistsService.findById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    console.log('patch wishlists/:id', updateWishlistDto, `id: ${id}`);
    return this.wishlistsService.update(+id, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('delete wishlists/:id', `id: ${id}`);
    return this.wishlistsService.remove(+id);
  }
}
