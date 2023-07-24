import { BasicEntity } from 'src/common/basic.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Wishlist extends BasicEntity {
  @Column({ length: 250, default: 'Мой вишлист' })
  name: string;

  @Column({ default: 'https://i.pravatar.cc/150?img=3' })
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish, (wish) => wish.name)
  @JoinTable()
  items: Wish[];
}
