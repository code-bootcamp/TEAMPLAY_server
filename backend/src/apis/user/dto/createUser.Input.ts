import { Field, InputType, OmitType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserInput extends OmitType(
  User,
  ['id', 'createdAt', 'deletedAt'],
  InputType,
) {
  @Field(() => String)
  password!: string;
}
