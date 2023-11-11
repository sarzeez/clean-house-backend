import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { diskStorage } from 'multer';
import { UserService } from '../service/user.service';
import { UpdateUserDto, UserDto } from '../dto/user.dto';
import { encryptPassword } from '@/utils/bcrypt';
import { Role, User } from '../entity/user.entity';
import { UserProfileDto } from '../dto/profile.dto';
import { JwtPayload, ProfileType } from '../type/user.type';
import { Roles } from '@/features/auth/decorator/role.decorator';
import { Public } from '@/features/auth/decorator/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from '@/features/file/entity/file.entity';
import { FileService } from '@/features/file/service/file.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private fileService: FileService,
  ) {}

  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  async getMe(@Request() req) {
    const bodyUser: JwtPayload = req.user;
    const user = await this.userService.getUserByEmail(bodyUser.email);
    const serialized = plainToInstance(User, user);
    return serialized;
  }

  @Roles([Role.ROLE_ADMIN])
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getUsers() {
    const users = await this.userService.getUsers();
    const serialized = plainToInstance(User, users);
    return serialized;
  }

  @Roles([Role.ROLE_ADMIN])
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUser(id);

    if (!user) {
      throw new NotFoundException();
    }

    const serialized = plainToInstance(User, user);
    return serialized;
  }

  @Public()
  @Post()
  async createUser(@Body() createUserDto: UserDto) {
    const { email, password } = createUserDto;
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      throw new BadRequestException('Email is already exist');
    }

    const hashedPassword = encryptPassword(password);
    await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    const user = await this.userService.getUser(id);

    if (!user) {
      throw new NotFoundException();
    }

    this.userService.updateUser(id, data);
  }

  @Roles([Role.ROLE_ADMIN])
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUser(id);

    if (!user) {
      throw new NotFoundException();
    }

    await this.userService.deleteUser(id);
  }

  @Put(':id/profile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const splittedFileName = file.originalname.split('.');
          const fileExtension = splittedFileName[splittedFileName.length - 1];
          callback(null, `${Date.now()}.${fileExtension}`);
        },
      }),
    }),
  )
  async updateUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UserProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 3,
            message: () =>
              `Validation failed (expected size is less than 3 MB)`,
          }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const user = await this.userService.getUser(id);
    if (!user) {
      throw new BadRequestException();
    }

    let newFile: File;
    if (file) {
      newFile = await this.fileService.createFile({
        path: `uploads/${file.filename}`,
        originalName: file.originalname,
        mimeType: file.mimetype,
      });
    }
    const data: ProfileType = { ...body, avatar: newFile };

    if (user.profile) {
      await this.userService.updateUserProfile(user.id, user.profile.id, data);
      return;
    }
    await this.userService.createUserProfile(id, data);
  }
}
