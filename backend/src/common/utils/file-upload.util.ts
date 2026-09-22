import { BadRequestException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const logger = new Logger('FileUploadUtil');

export interface MagicBytesResult {
  valid: boolean;
  ext: string;
  mime: string;
}

/**
 * Validates magic bytes of an image buffer.
 * Supports JPEG (FF D8 FF), PNG (89 50 4E 47), and WebP (RIFF....WEBP).
 */
export function validateImageMagicBytes(buffer: Buffer): MagicBytesResult {
  if (!buffer || buffer.length < 12) {
    throw new BadRequestException('File tidak valid atau rusak');
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, ext: '.jpg', mime: 'image/jpeg' };
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { valid: true, ext: '.png', mime: 'image/png' };
  }

  // WebP: RIFF at 0..3 and WEBP at 8..11
  const isRiff =
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
  const isWebp =
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;

  if (isRiff && isWebp) {
    return { valid: true, ext: '.webp', mime: 'image/webp' };
  }

  throw new BadRequestException(
    'Tipe file tidak diizinkan. Hanya file JPEG, PNG, dan WebP yang diperbolehkan',
  );
}

/**
 * Resolves root uploads directory from process.env.UPLOAD_DIR or default ./uploads
 */
export function getUploadRootDir(): string {
  const envUploadDir = process.env.UPLOAD_DIR;
  if (envUploadDir) {
    // If relative, resolve against cwd
    return path.isAbsolute(envUploadDir)
      ? path.resolve(envUploadDir, '..') // if UPLOAD_DIR points to ./uploads/kategori-sampah
      : path.resolve(process.cwd(), 'uploads');
  }
  return path.resolve(process.cwd(), 'uploads');
}

export function getUploadDir(subdir = 'kategori-sampah'): string {
  const envUploadDir = process.env.UPLOAD_DIR;
  if (envUploadDir) {
    const configuredDir = path.isAbsolute(envUploadDir)
      ? envUploadDir
      : path.resolve(process.cwd(), envUploadDir);
    const uploadRoot = path.basename(configuredDir) === 'uploads'
      ? configuredDir
      : path.dirname(configuredDir);
    return path.resolve(uploadRoot, subdir);
  }
  return path.resolve(process.cwd(), 'uploads', subdir);
}

export function getKategoriUploadDir(): string {
  return getUploadDir('kategori-sampah');
}

/**
 * Saves an uploaded buffer to disk in a random UUID-named file.
 * Returns the relative path for database storage (e.g. kategori-sampah/uuid.jpg).
 */
export async function saveUploadedFile(
  buffer: Buffer,
  ext: string,
  subdir = 'kategori-sampah',
): Promise<{ relativePath: string; fullPath: string }> {
  const targetDir = getUploadDir(subdir);
  await fs.promises.mkdir(targetDir, { recursive: true });

  const randomFilename = `${uuidv4()}${ext}`;
  const fullPath = path.join(targetDir, randomFilename);
  const relativePath = `${subdir}/${randomFilename}`;

  await fs.promises.writeFile(fullPath, buffer);
  return { relativePath, fullPath };
}

/**
 * Deletes a file safely from disk.
 * Returns true if deleted, false if file did not exist or failed (does not throw).
 */
export async function deleteFileSafe(relativePath: string | null | undefined): Promise<boolean> {
  if (!relativePath) return false;
  try {
    const rootDir = getUploadRootDir();
    const fullPath = path.resolve(rootDir, relativePath);

    // Guard against directory traversal
    if (!fullPath.startsWith(rootDir)) {
      logger.warn(`Potential path traversal attempt detected: ${relativePath}`);
      return false;
    }

    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      return true;
    }
  } catch (err) {
    logger.warn(`Gagal menghapus file: ${relativePath}. Error: ${(err as Error).message}`);
  }
  return false;
}

/**
 * Constructs absolute URL for a photo.
 */
export function buildPhotoUrl(
  foto: string | null | undefined,
  baseUrlOverride?: string,
): string | null {
  if (!foto) return null;
  const base =
    baseUrlOverride ||
    process.env.PUBLIC_BASE_URL ||
    `http://localhost:${process.env.PORT || 3001}`;
  const normalizedBase = base.replace(/\/+$/, '');
  const normalizedPath = foto.replace(/^\/+/, '');
  return `${normalizedBase}/uploads/${normalizedPath}`;
}
