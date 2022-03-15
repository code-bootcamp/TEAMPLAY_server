import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthResolver } from './auth.resolver';
import { TokenService } from './token.service';
import { TokenPhone } from './entities/tokenPhone.entity';
import { TokenEmail } from './entities/tokenEmail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TokenPhone, TokenEmail])],
  providers: [AuthResolver, TokenService],
})
export class AuthModule {}
