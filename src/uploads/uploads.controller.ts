import {
  BadRequestException,
  Controller,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3';
import { Public } from 'src/auth/ui/guards/auth.guard';

interface UploadedFileData {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

@Controller('uploads')
@Public()
export class UploadsController {
  private readonly s3: S3Client;
  private readonly bucket = process.env.S3_BUCKET_NAME!;
  private readonly region = 'ap-northeast-2';

  constructor() {
    const s3Config: S3ClientConfig = {
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_KEY!,
        secretAccessKey: process.env.AWS_SECRET!,
      },
    };

    this.s3 = new S3Client(s3Config);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: UploadedFileData | undefined) {
    // ⭐ 먼저 확인
    // console.log('file:', file);

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const key = `uploads/${Date.now()}-${file.originalname}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

      return {
        key,
        url,
      };
    } catch (error) {
      console.error('======= S3 UPLOAD ERROR =======');
      console.error(error);
      console.error('===============================');

      throw new InternalServerErrorException('S3 upload failed');
    }
  }
}
