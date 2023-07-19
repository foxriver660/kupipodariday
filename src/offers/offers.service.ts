import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto) {
    try {
      const savedOffer = await this.offerRepository.save(createOfferDto);
      return savedOffer;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const allOffers = await this.offerRepository.find();
      return allOffers;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: number) {
    try {
      const findOffer = await this.offerRepository.findOne({ where: { id } });
      if (!findOffer) {
        throw new NotFoundException('Requested offer was not found');
      }
      return findOffer;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
