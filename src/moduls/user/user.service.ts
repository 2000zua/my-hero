import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { PublicErrors } from 'src/shared/enums/public-errors.enum';
import { PrismaService } from 'nestjs-prisma';
import { AuthService } from 'src/auth/auth.service';
import { User } from './shared/user.model';
import { ChangePasswordInput } from './dto/change-password.input';
import { HeroIdArgs  } from '../hero/dto/hero-id.args';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService, private authService: AuthService) {}

  async updateUser(userId: string, newUserData: UpdateUserInput) {
    return this.prisma.user.update({
      data: newUserData, where: { id: userId}
    });
  }

  async removeHero(user: User, heroIdArgs: HeroIdArgs) {
    const userHeroes = await this.getHeroes(user);
    if (!userHeroes?.find(hero => hero.id === heroIdArgs.heroId)) {
      throw new NotFoundException({
        code: PublicErrors.HERO_NIT_FOUND,
        message: `Hero not found`,
      });
    }

    return await this.prisma.hero.delete({
      where: {
        id: heroIdArgs.heroId,
      },
    });
  }

  getHeroes(author: { id: string }) {
    return this.prisma.user.findUnique({ where: { id: author.id } }).heroes();
  }

  async changePassword(userId: string, userPassword: string, changePassword: ChangePasswordInput) {
    const passwordValid = await AuthService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      throw new BadRequestException({
        code: PublicErrors.INVALID_CREDENTIALS,
        message: `Invalid credentials`,
      });
    }

    const hashedPassword = await this.authService.hashPassword(changePassword.newPassword);

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }
}
