import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenPhone } from '../auth/entities/tokenPhone.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, TokenPhone])],
  providers: [UserResolver, UserService],
})
export class UserModule {}
