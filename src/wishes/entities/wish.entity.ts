import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BasicEntity } from 'src/common/basic.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Wish extends BasicEntity {
  @Column({ length: 250 })
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ default: 0 })
  raised: number;

  @Column({ default: 0 })
  copied: number;

  @Column({ length: 1024 })
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
