import { BaseEntity } from 'src/entity/base.entity';
import { Entity, Column, OneToMany, Unique } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  about: string;

  @Column({ nullable: true })
  avatar: string;

  // @OneToMany(() => Wish, wish => wish.user)
  // wishes: Wish[];

  // @OneToMany(() => Wish, wish => wish.user)
  // offers: Wish[];

  // @ManyToOne(() => Wishlist, wishlist => wishlist.owner)
  // wishlists: Wishlist[];
}
