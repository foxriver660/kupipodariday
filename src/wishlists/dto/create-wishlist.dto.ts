import { IsArray, IsInt, IsString, IsUrl } from 'class-validator';

export class CreateWishlistDto {
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
