import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEmail } from '../auth/entities/tokenEmail.entity';
import { TokenPhone } from '../auth/entities/tokenPhone.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, TokenPhone, TokenEmail])],
  providers: [UserResolver, UserService],
})
export class UserModule {}
