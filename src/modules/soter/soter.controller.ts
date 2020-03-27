import {Body, Controller, Get, Header, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import { Response } from 'express';
import {UploadHandler} from './useCase/uploadFile/uploadHandler';
import {ArchiveHandler} from './useCase/archiveFile/archiveHandler';
import {UnzipHandler} from './useCase/unzipFile/unzipHandler';
import {Command as UploadCommand} from './useCase/uploadFile/command';
import * as fs from 'fs';

@Controller('/v1/soter')
export class SoterController {
    constructor(
        private readonly uploadHandler: UploadHandler,
        private readonly archiveFileHandler: ArchiveHandler,
        private readonly unzipFileHandler: UnzipHandler,
    ) {}

    @Post('/upload')
    @UseInterceptors(
        FileInterceptor('file'),
    )
     public async uploadFile(@Body('id') id, @UploadedFile() file, @Res() res: Response) {
        await this.uploadHandler.handle(new UploadCommand(file, id));
        return res.status(200).send({message: 'File success uploaded!'});
    }

    @Post('/archive')
    async archiveFiles(@Res() res: Response) {
        await this.archiveFileHandler.handle();
        return res.status(200).send({message: 'Hello'});
    }

    @Get('/unzip')
    @Header('Content-Disposition', 'attachment;')
    async unzipFile(@Res() res: Response) {
        const file = await this.unzipFileHandler.handle();
        return res.end(file);
    }

    @Get('/unzip/json')
    async unzipJson(@Res() res: Response) {
        const json = await this.unzipFileHandler.handle();
        console.log(JSON.parse(json.toString()));
        return res.send(JSON.parse(json.toString()));
    }
}