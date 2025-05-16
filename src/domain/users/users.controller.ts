import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOneUser({ id: +id });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: "Mettre à jour le prénom et/ou nom d'un utilisateur",
  })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    const user = await this.usersService.findOneUser({ id: +id });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const updatedUser = await this.usersService.updateUser(+id, updateUserDto);
    return {
      id: updatedUser.id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      updated_at: updatedUser.updated_at,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Supprimer définitivement un utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur supprimé définitivement',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async remove(@Param('id') id: string): Promise<void> {
    const user = await this.usersService.findOneUser({ id: +id });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.usersService.deleteUser(+id);
  }
<<<<<<< HEAD
}
=======

  @Get(':userId/restaurants')
  @ApiOperation({ summary: "Récupérer les restaurants d'un utilisateur" })
  @ApiResponse({ status: 200, description: 'Restaurants trouvés' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async getRestaurantsByUserId(
    @Param('userId') userId: string,
  ): Promise<Restaurant[]> {
    try {
      const restaurants =
        await this.usersService.getRestaurantsByUserId(+userId);
      return restaurants;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
>>>>>>> 52243027383f1a8f1f472e0a5140de2c36e14512
