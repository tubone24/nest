import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer'
import { AppService } from './app.service';
import { UploadDTO } from './uploadDTO';
import { extname } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  sayHello() {
    return this.appService.getHello();
  }

  @UseInterceptors(FileInterceptor('file',  {
    storage: diskStorage({
      destination: './uploads' // destinationはFileInterceptorで指定可能
      , filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })}))
  @Post('file')
  uploadFile(
    @Body() body: UploadDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    file.destination
    console.log('fileupload');
    console.log(body.name);
    console.log(file.destination);
    return {
      body,
      // file: file.buffer.byteLength, //destinationを設定するとbufferには入らなくなる
    };
  }
}
