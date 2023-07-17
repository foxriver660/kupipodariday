import { BaseEntity } from 'src/entity/base.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Offer extends BaseEntity {
  @Column()
  amount: number;

  @Column({ default: false })
  hidden: boolean;

  // @ManyToOne(() => User, (user) => user.wishlists)
  // item: User;

  // @OneToMany(() => WishPartial, (wish) => wish.wishlist)
  // user: WishPartial[];
}
