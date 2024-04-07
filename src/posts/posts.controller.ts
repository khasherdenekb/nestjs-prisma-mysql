import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateGroupPostDto, CreatePostDto } from './dto/Posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
  @Post()
  @UsePipes(CreatePostDto)
  createPost(@Body() { userId, ...createPostDto }: CreatePostDto) {
    return this.postsService.createPost(userId, createPostDto);
  }

  @Post('group')
  @UsePipes(CreateGroupPostDto)
  createGroupPost(
    @Body() { userIds, ...createGroupPostDto }: CreateGroupPostDto,
  ) {
    return this.postsService.createGroupPosts(userIds, createGroupPostDto);
  }
}
