import { BaseEntity } from 'src/entity/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Offer extends BaseEntity {
  @Column()
  amount: number;

  @Column({ default: false })
  hidden: boolean;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @OneToMany(() => User, (user) => user.offers)
  user: User;
}
