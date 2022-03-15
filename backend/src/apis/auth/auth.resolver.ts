import { UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TokenService } from './token.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly tokenService: TokenService) {}

  @Mutation(() => String)
  async tokenPhone(@Args('phone') phone: string) {
    if (this.tokenService.checkValidationPhone({ phone })) {
      const mytoken = this.tokenService.getToken(4);
      // await this.tokenService.sendTokenToSMS({ phone, mytoken });
      await this.tokenService.createTokenPhone({ phone, mytoken });
      return `${phone}으로 인증번호가 전송되었습니다. ${mytoken}`;
    } else {
      throw new UnauthorizedException('핸드폰 번호를 확인해주세요');
    }
  }

  @Mutation(() => Boolean)
  async authPhone(@Args('phone') phone: string, @Args('token') token: string) {
    return await this.tokenService.checkTokenPhone({ phone, token });
  }

  @Mutation(() => String)
  async tokenEmail(@Args('email') email: string) {
    if (this.tokenService.checkEmail({ email })) {
      const mytoken = this.tokenService.getToken(6);
      const template = this.tokenService.getTemplateToken({ mytoken });
      // await this.tokenService.sendEmail({ email, template });
      await this.tokenService.createTokenEmail({ email, mytoken });
      return `${email}으로 인증번호가 전송되었습니다. ${mytoken}`;
    } else {
      throw new UnauthorizedException('이메일을 확인해주세요');
    }
  }

  @Mutation(() => Boolean)
  async authEmail(@Args('email') email: string, @Args('token') token: string) {
    return await this.tokenService.checkTokenEmail({ email, token });
  }
}
