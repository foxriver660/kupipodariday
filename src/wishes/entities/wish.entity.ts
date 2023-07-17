import { BaseEntity, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Wish extends BaseEntity {
  @Column({ length: 250 })
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'float' })
  raised: number;

  @Column({ default: 0 })
  copied: number;

  @Column({ length: 1024 })
  description: string;

  // @ManyToOne(() => User, (user) => user.wishes)
  // owner: User;

  // @OneToMany(() => Offer, (offer) => offer.wish)
  // offers: Offer[];
}
