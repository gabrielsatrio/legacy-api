import dotEnv from 'dotenv';
import fs from 'fs';
import request from 'request';

dotEnv.config();

export const getReport = (
  url: string,
  username: string,
  password: string,
  filePath: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    request(url, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        console.error('error:', error);
        reject(error);
      }
    })
      .auth(username, password, false)
      .pipe(fs.createWriteStream(filePath));
  });
};
