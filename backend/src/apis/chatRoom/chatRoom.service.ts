import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventGateway } from '../event/event.gateway';
import { User } from '../user/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { ChatRoom } from './entities/chatRoom.entity';
import { ChatRoomMember } from './entities/chatRoomMember.entity';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ChatRoomMember)
    private readonly chatRoomMemberRepository: Repository<ChatRoomMember>,

    private eventGateWay: EventGateway,
  ) {}

  async findChatRooms({ id }) {
    // const aaa = this.chatRepository
    //   .createQueryBuilder('chat')
    //   .subQuery()
    //   .select('chat.chatRoom as chatRoomId')
    //   .from(Chat, 'chat')
    //   .limit(1)
    //   .getQuery();

    const chatRoom = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .innerJoin('chatRoom.chatRoomMembers', 'chatRoomMembers', 'chatRoomMembers.user = :user', { user: id })
      // .leftJoinAndSelect(aaa, 'chat', 'chat.chatRoomId = chatRoom.id')
      // .where(qb => {
      //   const aaa = qb.subQuery().select('chatRoomId').from(Chat, 'chat').limit(1).getQuery();
      //   return 'chatRoom.id = ' + aaa;
      // })
      .getMany();

    return chatRoom;
  }

  async findChats({ chatRoomId, page }) {
    const chat = await this.chatRepository
      .createQueryBuilder('chat')
      .where('chat.chatRoom = :chatRoomId', { chatRoomId })
      .innerJoinAndSelect('chat.user', 'user')
      .orderBy('chat.id', 'ASC')
      .take(20)
      .skip(20 * (page - 1))
      .getMany();
    return chat;
  }

  async findChatRoomMembers({ chatRoomId }) {
    return await this.chatRoomMemberRepository.find({
      where: { chatRoom: chatRoomId },
      relations: ['user'],
    });
  }

  async createChatRoomMembers({ userId, projectId }) {
    const chatRoom = await this.chatRoomRepository.findOne({ project: projectId });
    const user = await this.userRepository.findOne({ id: userId });
    const chatRoomUser = await this.chatRoomMemberRepository.findOne({ user: userId });
    if (chatRoomUser) throw new BadRequestException('이미 참여중인 회원입니다');
    this.eventGateWay.server.emit('join' + chatRoom.id, user);
    return await this.chatRoomMemberRepository.save({
      chatRoom,
      user,
    });
  }

  async createChat({ message, id, chatRoomId }) {
    const user = await this.userRepository.findOne({ id });

    const chat = await this.chatRepository.save({
      content: message,
      user,
      chatRoom: chatRoomId,
    });
    this.eventGateWay.server.emit('message' + chatRoomId, chat);
    return '채팅저장성공';
  }
}
