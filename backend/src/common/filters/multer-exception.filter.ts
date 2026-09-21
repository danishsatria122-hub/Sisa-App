import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, PayloadTooLargeException } from '@nestjs/common';
import { MulterError } from 'multer';
import { Response } from 'express';

@Catch(MulterError, PayloadTooLargeException)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const maxMb = process.env.MAX_UPLOAD_MB || '2';

    if (exception?.code === 'LIMIT_FILE_SIZE' || exception instanceof PayloadTooLargeException) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Ukuran file terlalu besar. Maksimal ${maxMb} MB`,
        error: 'Bad Request',
      });
    }

    if (exception.code === 'LIMIT_FILE_COUNT') {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Hanya boleh mengunggah 1 file foto',
        error: 'Bad Request',
      });
    }

    return response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      error: 'Bad Request',
    });
  }
}
