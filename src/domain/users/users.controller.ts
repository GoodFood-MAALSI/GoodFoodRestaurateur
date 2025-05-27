import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpException, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { User } from "./entities/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { JwtPayloadType } from "../auth/strategies/types/jwt-payload.type";
import { User as UserDecorator } from './decorators/user.decorator';

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Récupérer un utilisateur par ID" })
  @ApiResponse({ status: 200, description: "Utilisateur trouvé"})
  @ApiResponse({ status: 404, description: "Utilisateur non trouvé" })
  async findOne(
    @Param('id') id: string,
    @UserDecorator() currentUser: JwtPayloadType,
  ): Promise<User> {
    const userId = +id;

    if (!currentUser?.id) {
      throw new HttpException(
        'Utilisateur non authentifié',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (currentUser.id !== userId) {
      throw new HttpException(
        'Vous ne pouvez accéder qu’à votre propre compte',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.usersService.findOneUser({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Mettre à jour le prénom et/ou nom d'un utilisateur" })
  @ApiResponse({ status: 200, description: "Utilisateur mis à jour"})
  @ApiResponse({ status: 404, description: "Utilisateur non trouvé" })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UserDecorator() currentUser: JwtPayloadType,
  ): Promise<Partial<User>> {
    const userId = +id;

    if (!currentUser?.id) {
      throw new HttpException(
        'Utilisateur non authentifié',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (currentUser.id !== userId) {
      throw new HttpException(
        'Vous ne pouvez modifier que votre propre compte',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.usersService.findOneUser({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const updatedUser = await this.usersService.updateUser(
      userId,
      updateUserDto,
    );
    return {
      id: updatedUser.id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      updated_at: updatedUser.updated_at,
    };
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "Supprimer définitivement un utilisateur" })
  @ApiResponse({ status: 200, description: "Utilisateur supprimé définitivement" })
  @ApiResponse({ status: 404, description: "Utilisateur non trouvé" })
  async remove(
    @Param('id') id: string,
    @UserDecorator() currentUser: JwtPayloadType,
  ): Promise<{ message: string }> {
    const userId = +id;
    console.log('User ID from param:', userId);
    console.log('Current user:', currentUser);

    if (!currentUser?.id) {
      throw new HttpException(
        'Utilisateur non authentifié',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (currentUser.id !== userId) {
      throw new HttpException(
        'Vous ne pouvez supprimer que votre propre compte',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.usersService.findOneUser({ id: userId });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return this.usersService.deleteUser(userId);
  }
}