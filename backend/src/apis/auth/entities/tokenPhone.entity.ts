import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class TokenPhone {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id!: string;

  @Column({ unique: true })
  @Field(() => String)
  phone!: string;

  @Column()
  @Field(() => String)
  token!: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isAuth!: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt!: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;
}
