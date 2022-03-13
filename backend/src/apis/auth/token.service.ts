import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { TokenPhone } from './entities/tokenPhone.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenPhone)
    private readonly tokenPhoneRepository: Repository<TokenPhone>,
  ) {}

  checkValidationPhone({ phone }) {
    return (
      (phone.length === 10 || phone.length === 11) &&
      phone.split('').every((e) => !Number.isNaN(+e))
    );
  }

  getToken(mycount) {
    return String(Math.floor(Math.random() * 10 ** mycount)).padStart(
      mycount,
      '0',
    );
  }

  async sendTokenToSMS({ phone, mytoken }) {
    const appKey = process.env.SMS_APP_KEY;
    const XSecretKey = process.env.SMS_X_SECRET_KEY;
    const sender = process.env.SMS_SENDER;

    await axios.post(
      `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${appKey}/sender/sms`,
      {
        body: `안녕하세요. planT 회원가입 인증번호는 ${mytoken}입니다.`,
        sendNo: sender,
        recipientList: [
          {
            internationalRecipientNo: phone,
          },
        ],
      },
      {
        headers: {
          'X-Secret-Key': XSecretKey,
          'Content-Type': 'application/json;charset=UTF-8',
        },
      },
    );
  }

  async createTokenPhone({ phone, mytoken }) {
    const myphone = await this.tokenPhoneRepository.findOne({ phone });
    if (myphone) {
      const newToken = {
        ...myphone,
        token: mytoken,
        isAuth: false,
      };
      await this.tokenPhoneRepository.save(newToken);
    } else {
      await this.tokenPhoneRepository.save({
        phone,
        token: mytoken,
      });
    }
  }

  async checkToken({ phone, token }) {
    const myphone = await this.tokenPhoneRepository.findOne({ phone });
    if (!myphone || myphone.token !== token) {
      return false;
    } else {
      await this.tokenPhoneRepository.update({ phone }, { isAuth: true });
      return true;
    }
  }
}
