import { Controller, Get, Patch, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get my profile' })
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update my profile' })
  updateProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.usersService.updateProfile(user.id, body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
