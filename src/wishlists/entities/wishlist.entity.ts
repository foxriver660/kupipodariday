import { BaseEntity } from 'src/entity/base.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Wishlist extends BaseEntity {
  @Column({ length: 250 })
  name: string;

  @Column()
  image: string;

  // @ManyToOne(() => User, (user) => user.wishlists)
  // owner: User;

  // @OneToMany(() => WishPartial, (wish) => wish.wishlist)
  // items: WishPartial[];
}
