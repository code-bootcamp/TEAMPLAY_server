import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum GENDER_ENUM {
  MAN = 'M',
  WOMAN = 'W',
}
registerEnumType(GENDER_ENUM, {
  name: 'GENDER_ENUM',
});

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id!: string;

  @Column({ unique: true })
  @Field(() => String)
  email!: string;

  @Column()
  password!: string;

  @Column()
  @Field(() => String)
  name!: string;

  @Column({ unique: true })
  @Field(() => String)
  phone!: string;

  @Column({ unique: true })
  @Field(() => String)
  nickname!: string;

  @Column()
  @Field(() => String)
  personal!: string;

  @Column({ type: 'enum', enum: GENDER_ENUM })
  @Field(() => GENDER_ENUM)
  gender!: GENDER_ENUM;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  intro?: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt!: Date;

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
