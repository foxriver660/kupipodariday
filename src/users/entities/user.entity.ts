import { BaseEntity } from 'src/entity/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  about: string;

  @Column()
  avatar: string;

  // @OneToMany(() => Wish, wish => wish.user)
  // wishes: Wish[];

  // @OneToMany(() => Wish, wish => wish.user)
  // offers: Wish[];

  // @ManyToOne(() => Wishlist, wishlist => wishlist.owner)
  // wishlists: Wishlist[];
}
