import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { getCurrentUserId } from '../../shared/user/current-user';
import { UserContextService } from '../application/user-context.service';

@Controller('user')
export class UserController {
  constructor(private readonly userContextService: UserContextService) {}

  @Get('profile')
  getProfile(@Req() request: Request) {
    return this.userContextService.getProfile(getCurrentUserId(request));
  }
}
