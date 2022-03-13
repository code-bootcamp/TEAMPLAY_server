import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthResolver } from './auth.resolver';
import { TokenService } from './token.service';
import { TokenPhone } from './entities/tokenPhone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TokenPhone])],
  providers: [AuthResolver, TokenService],
})
export class AuthModule {}
