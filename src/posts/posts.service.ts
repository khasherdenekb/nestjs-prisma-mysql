import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  createPost(userId: number, data: Prisma.PostCreateWithoutAuthorInput) {
    return this.prisma.post.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  createGroupPosts(
    usersIds: number[],
    data: Prisma.GroupPostCreateWithoutUsersInput,
  ) {
    return this.prisma.groupPost.create({
      data: {
        ...data,
        users: {
          create: usersIds.map((userId) => ({
            userId,
          })),
        },
      },
    });
  }
}
