import {
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtUserPayload } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';

@ApiTags('Profil')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('profil')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil profil user yang login' })
  getProfile(@CurrentUser() user: JwtUserPayload, @Req() req: any) {
    return this.service.getProfile(user.userId, this.getBaseUrl(req));
  }

  @Patch()
  @ApiOperation({ summary: 'Update profil user yang login' })
  updateProfile(@CurrentUser() user: JwtUserPayload, @Req() req: any) {
    return this.service.updateProfile(user.userId, req.body ?? {});
  }

  @Patch('foto')
  @UseInterceptors(
    FileInterceptor('foto', {
      limits: { fileSize: (parseInt(process.env.MAX_UPLOAD_MB || '1', 10)) * 1024 * 1024, files: 1 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        foto: {
          type: 'string',
          format: 'binary',
          description: 'Foto profil (JPEG, PNG, WebP, max 1MB)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload foto profil user yang login' })
  uploadPhoto(@CurrentUser() user: JwtUserPayload, @UploadedFile() file?: Express.Multer.File, @Req() req?: any) {
    if (!file) {
      throw new BadRequestException('File foto wajib diunggah');
    }
    return this.service.uploadPhoto(user.userId, file, this.getBaseUrl(req));
  }

  @Delete('foto')
  @ApiOperation({ summary: 'Hapus foto profil user yang login' })
  deletePhoto(@CurrentUser() user: JwtUserPayload, @Req() req?: any) {
    return this.service.deletePhoto(user.userId, this.getBaseUrl(req));
  }

  private getBaseUrl(req: any): string {
    if (!req) return '';
    return `${req.protocol}://${req.get('host')}`;
  }
}
