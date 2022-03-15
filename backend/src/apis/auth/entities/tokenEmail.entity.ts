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
export class TokenEmail {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id!: string;

  @Column({ unique: true })
  @Field(() => String)
  email!: string;

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
  updatedAt!: Date;
}
