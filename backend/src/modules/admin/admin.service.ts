import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Omit<Admin, 'password'>> {
    const existing = await this.adminRepository.findOne({
      where: { email: createAdminDto.email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const admin = this.adminRepository.create({
      name: createAdminDto.name,
      email: createAdminDto.email,
      password: hashedPassword,
    });

    const saved = await this.adminRepository.save(admin);
    const { password, ...result } = saved;
    return result;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<Omit<Admin, 'password'>[]> {
    const admins = await this.adminRepository.find();
    return admins.map(({ password, ...rest }) => rest);
  }

  async findOne(id: string): Promise<Omit<Admin, 'password'> | null> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) return null;
    const { password, ...result } = admin;
    return result;
  }
}
