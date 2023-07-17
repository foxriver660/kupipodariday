import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsInt, IsString, IsUrl } from 'class-validator';
import { CreateWishlistDto } from './create-wishlist.dto';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @IsString()
  name: string;

  @IsUrl(
    {
      protocols: ['http', 'https'],
    },
    { message: 'Image should be a valid URL' },
  )
  image: string;

  @IsArray()
  @IsInt({ each: true })
  itemsId: number[];
}
