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
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Req() { user }, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(user, createWishlistDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.wishlistsService.findById(+id, ['owner', 'items']);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(+id, updateWishlistDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() { user }, @Param('id') id: string) {
    return this.wishlistsService.remove(user, +id);
  }
}
