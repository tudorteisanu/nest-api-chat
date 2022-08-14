import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EntityMetadataNotFoundError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private encryptPassword(password: string): string {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  }

  public comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  public async create(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const userExists = await this.usersRepository.findOneBy({ email });

    if (userExists) {
      throw new UnprocessableEntityException('User exists');
    }

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: this.encryptPassword(createUserDto.password),
    });

    return this.usersRepository.save(newUser);
  }

  public findAll() {
    return this.usersRepository.find();
  }

  public findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  public async findOneBy(where: Record<string, string | number>) {
    try {
      return await this.usersRepository.findOneBy(where);
    } catch (e: any) {
      if (e instanceof EntityMetadataNotFoundError) {
        throw new NotFoundException('User not found');
      }
      throw new InternalServerErrorException(
        'Internal server error. Please, contact the support team',
      );
    }
  }

  public update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  public async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
