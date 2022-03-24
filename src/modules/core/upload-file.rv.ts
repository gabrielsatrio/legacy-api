import config from '@/config/main';
import { UploadResponse } from '@/types/upload-response';
import { getDateString } from '@/utils/get-date-string';
import { mapError } from '@/utils/map-error';
import crypto from 'crypto';
import fs from 'fs';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Arg, Mutation } from 'type-graphql';
import { File } from './entities/file';

const isProd = config.env === 'production';
const isTest = config.env === 'test';

export class UploadFileResolver {
  @Mutation(() => File)
  // @UseMiddleware(isAuth)
  async uploadFile(
    @Arg('file', () => GraphQLUpload) file: FileUpload,
    @Arg('uploadDirectory') uploadDirectory: string
  ): Promise<UploadResponse> {
    try {
      const { createReadStream, mimetype, encoding, filename } = file;
      const prefix = getDateString(new Date());
      const seq = crypto.randomBytes(1).toString('hex');
      const newFilename = `${prefix}-${seq}-${filename.replace(/ /g, '_')}`;
      const path = `uploads${uploadDirectory}/${newFilename}`;
      const url = `http${isProd || isTest ? 's' : ''}://${config.api.hostname}${
        !isProd && !isTest ? `:${config.api.port}` : ''
      }/${path}`;
      const stream = createReadStream();

      return new Promise((resolve, reject) => {
        stream
          .pipe(fs.createWriteStream(path))
          .on('finish', () => {
            resolve({
              success: true,
              message: 'File uploaded successfully',
              mimetype,
              filename,
              encoding,
              url
            });
          })
          .on('error', (err: Record<string, unknown>) => {
            console.error('Error event emitted!', err);
            reject({
              success: false,
              message: 'Error uploading file',
              mimetype: null,
              filename: null,
              encoding: null,
              url: null
            });
          });
      });
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
}
