import { HttpException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: {
        ...data,
        userSetting: {
          create: { smsEnable: true, notificationsOn: false },
        },
      },
    });
  }

  getUsers() {
    return this.prisma.user.findMany({
      include: { userSetting: true, posts: true, groupPosts: true },
    });
  }

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userSetting: {
          select: {
            smsEnable: true,
            notificationsOn: true,
          },
        },
        posts: true,
      },
    });
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput) {
    const user = await this.getUser(id);
    if (!user) throw new HttpException('User not found', 404);

    if (data.username) {
      const isUsernameAlreadyTaken = await this.prisma.user.findUnique({
        where: { username: data.username as string },
      });

      if (isUsernameAlreadyTaken) {
        throw new HttpException('Username is already taken', 400);
      }
    }

    return this.prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: number) {
    const user = await this.getUser(id);
    if (!user) throw new HttpException('User not found', 404);

    this.prisma.user.delete({ where: { id } });
    throw new HttpException('Successfully deleted', 200);
  }

  async updateUserSettings(
    userId: number,
    data: Prisma.UserSettingUpdateInput,
  ) {
    const user = await this.getUser(userId);
    if (!user) throw new HttpException('User not found', 404);
    if (!user.userSetting) {
      throw new HttpException('User settings not found', 404);
    }

    return this.prisma.userSetting.update({
      where: { userId },
      data,
    });
  }
}
