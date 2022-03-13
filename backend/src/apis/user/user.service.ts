import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenPhone } from '../auth/entities/tokenPhone.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TokenPhone)
    private readonly tokenPhoneRepository: Repository<TokenPhone>,
  ) {}

  async create({ createUserInput }) {
    await this.tokenPhoneRepository.update(
      { phone: createUserInput.phone },
      { isAuth: false },
    );
    return await this.userRepository.save(createUserInput);
  }

  async checkUser({ createUserInput }) {
    // const user = await Promise.all([
    //   this.userRepository.findOne({
    //     email: createUserInput.email,
    //   }),
    //   this.userRepository.findOne({
    //     phone: createUserInput.phone,
    //   }),
    //   this.userRepository.findOne({
    //     nickname: createUserInput.nickname,
    //   }),
    // ]);

    // const users = await this.userRepository
    //   .createQueryBuilder()
    //   .where('email = :email OR phone = :phone OR nickname = :nickname', {
    //     email: createUserInput.email,
    //     phone: createUserInput.phone,
    //     nickname: createUserInput.nickname,
    //   })
    //   .getMany();

    const users = await this.userRepository.find({
      where: [
        { email: createUserInput.email },
        { phone: createUserInput.phone },
        { nickname: createUserInput.nickname },
      ],
    });
    if (users.length)
      throw new ConflictException('회원정보 중복을 확인해주세요');
  }

  async checkPhone({ createUserInput }) {
    const myphone = await this.tokenPhoneRepository.findOne({
      phone: createUserInput.phone,
    });
    if (!myphone || !myphone.isAuth) {
      throw new UnauthorizedException('핸드폰 번호를 인증해주세요');
    }
  }
}
