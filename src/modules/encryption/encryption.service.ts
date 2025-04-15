import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';

@Injectable()
export class EncryptionService {
  hash(data: string): Promise<string> {
    return argon2.hash(data);
  }

  verify(hash: string, data: string): Promise<boolean> {
    return argon2.verify(hash, data);
  }
}
