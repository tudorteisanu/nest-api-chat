import { extname } from 'path';

export class Helper {
  static customFileName(req, file, cb) {
    const now = Date.now();
    const randomName = Array(64)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    cb(null, `${randomName}-${now}${extname(file.originalname)}`);
  }

  static destinationPath(req, file, cb) {
    cb(null, `${process.cwd()}/storage/`);
  }

  static getFileUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }

    return `${process.env.APP_HOST}/${path}`;
  }

  static getPhoto(photo: any): any {
    if (!photo?.id) {
      return null;
    }

    return {
      id: photo.id,
      name: photo.originalname,
      size: photo.size,
      mimeType: photo.mimetype,
      url: this.getFileUrl(photo.path),
    };
  }
}
