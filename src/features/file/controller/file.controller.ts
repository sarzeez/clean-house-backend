import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('upload')
export class FileController {
  constructor() {
    //
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      storage: diskStorage({
        destination: './public/uploads/',
        filename: (req, file, callback) => {
          const splittedFileName = file.originalname.split('.');
          const fileExtension = splittedFileName[splittedFileName.length - 1];
          callback(null, `${Date.now()}.${fileExtension}`);
        },
      }),
      //   fileFilter: imageFileFilter,
    }),
  )
  uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: any,
  ) {
    if (!files) {
      throw new BadRequestException();
    }
    const response = [];
    files.forEach((file: Express.Multer.File) => {
      const fileReponse = {
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return { files: response, body: data };
  }
}
