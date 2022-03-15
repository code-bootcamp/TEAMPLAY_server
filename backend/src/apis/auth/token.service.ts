import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { TokenEmail } from './entities/tokenEmail.entity';
import { TokenPhone } from './entities/tokenPhone.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenPhone)
    private readonly tokenPhoneRepository: Repository<TokenPhone>,

    @InjectRepository(TokenEmail)
    private readonly tokenEmailRepository: Repository<TokenEmail>,
  ) {}

  checkValidationPhone({ phone }) {
    return (
      (phone.length === 10 || phone.length === 11) &&
      phone.split('').every((e) => !Number.isNaN(+e))
    );
  }

  checkEmail({ email }) {
    return email.includes('@') && email.includes('.');
  }

  getToken(mycount) {
    return String(Math.floor(Math.random() * 10 ** mycount)).padStart(
      mycount,
      '0',
    );
  }

  // async sendTokenToSMS({ phone, mytoken }) {
  //   const appKey = process.env.SMS_APP_KEY;
  //   const XSecretKey = process.env.SMS_X_SECRET_KEY;
  //   const sender = process.env.SMS_SENDER;

  //   await axios.post(
  //     `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${appKey}/sender/sms`,
  //     {
  //       body: `팀플 회원가입 인증번호는 ${mytoken}입니다.`,
  //       sendNo: sender,
  //       recipientList: [
  //         {
  //           internationalRecipientNo: phone,
  //         },
  //       ],
  //     },
  //     {
  //       headers: {
  //         'X-Secret-Key': XSecretKey,
  //         'Content-Type': 'application/json;charset=UTF-8',
  //       },
  //     },
  //   );
  // }

  getTemplateToken({ mytoken }) {
    return `
      <html>
        <body>
          <h1>팀플 회원가입 인증번호는 ${mytoken}입니다.</h1>
        </body>
      </html>
    `;
  }

  // async sendEmail({ email, template }) {
  //   const appKey = process.env.EMAIL_APP_KEY;
  //   const XSecretKey = process.env.EMAIL_X_SECRET_KEY;
  //   const sender = process.env.EMAIL_SENDER;

  //   await axios.post(
  //     `https://api-mail.cloud.toast.com/email/v2.0/appKeys/${appKey}/sender/mail`,
  //     {
  //       senderAddress: sender,
  //       title: `팀플 이메일 인증번호입니다.`,
  //       body: template,
  //       receiverList: [
  //         {
  //           receiveMailAddr: email,
  //           receiveType: 'MRT0',
  //         },
  //       ],
  //     },
  //     {
  //       headers: {
  //         'X-Secret-Key': XSecretKey,
  //         'Content-Type': 'application/json;charset=UTF-8',
  //       },
  //     },
  //   );
  // }

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

  async createTokenEmail({ email, mytoken }) {
    const myemail = await this.tokenEmailRepository.findOne({ email });
    if (myemail) {
      await this.tokenEmailRepository.update(
        { email },
        { token: mytoken, isAuth: false },
      );
    } else {
      await this.tokenEmailRepository.save({
        email,
        token: mytoken,
      });
    }
  }

  async checkTokenPhone({ phone, token }) {
    const myphone = await this.tokenPhoneRepository.findOne({ phone });
    if (!myphone || myphone.token !== token) {
      return false;
    } else {
      await this.tokenPhoneRepository.update({ phone }, { isAuth: true });
      return true;
    }
  }

  async checkTokenEmail({ email, token }) {
    const myemail = await this.tokenEmailRepository.findOne({ email });
    if (!myemail || myemail.token !== token) {
      return false;
    } else {
      await this.tokenEmailRepository.update({ email }, { isAuth: true });
      return true;
    }
  }
}
