import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
