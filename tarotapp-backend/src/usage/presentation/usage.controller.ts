import { Controller, Get, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { DomainError } from '../../shared/domain/domain-error';
import { getCurrentUserId } from '../../shared/user/current-user';
import { SpreadType } from '../../tarot/domain/tarot.enums';
import { UserContextService } from '../../user-context/application/user-context.service';
import { UsageService } from '../application/usage.service';

@Controller('usage')
export class UsageController {
  constructor(
    private readonly usageService: UsageService,
    private readonly userContextService: UserContextService,
  ) {}

  @Get('check')
  async check(@Req() request: Request, @Query('type') type?: string) {
    if (!type || !Object.values(SpreadType).includes(type as SpreadType)) {
      throw new DomainError('Query parameter type must be a valid spread type');
    }

    const userId = getCurrentUserId(request);
    const profile = await this.userContextService.getProfile(userId);
    return this.usageService.checkUsage(userId, profile.tier, type as SpreadType);
  }
}
