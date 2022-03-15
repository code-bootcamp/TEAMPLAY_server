import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.Input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import bcrypt from 'bcrypt';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  hello() {
    return 'hello';
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    await this.userService.checkUser({ createUserInput });
    await this.userService.checkPhone({ createUserInput });
    await this.userService.checkEmail({ createUserInput });
    createUserInput.password = await bcrypt.hash(createUserInput.password, 10);
    return await this.userService.create({ createUserInput });
  }
}
