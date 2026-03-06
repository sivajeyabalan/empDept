import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../modules/admin/admin.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {

    const admin = await this.adminService.findByEmail(email);

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}