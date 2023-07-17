import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto) {
    console.log('post offers', createOfferDto);
    return this.offersService.create(createOfferDto);
  }

  @Get()
  findAll() {
    console.log('get offers');
    return this.offersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    console.log('get offers/:id', `id: ${id}`);
    return this.offersService.findById(+id);
  }
}
