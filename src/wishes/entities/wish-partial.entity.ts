import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WishPartial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  createdAt: string;

  @Column({ type: 'text' })
  updatedAt: string;

  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column({ type: 'varchar' })
  link: string;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'integer' })
  raised: number;

  @Column({ type: 'integer' })
  copied: number;

  @Column({ type: 'text' })
  description: string;
}
