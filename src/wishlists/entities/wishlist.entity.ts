import { BaseEntity } from 'src/entity/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Wishlist extends BaseEntity {
  @Column({ length: 250, default: 'Мой вишлист' })
  name: string;

  @Column({ default: 'https://i.pravatar.cc/150?img=3' })
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  /* @OneToMany(() => WishPartial, (wish) => wish.wishlist)
  items: WishPartial[]; */
}
