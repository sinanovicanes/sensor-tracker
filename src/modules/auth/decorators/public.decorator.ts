import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = Symbol('isPublic');
export const Public = (state = true) => SetMetadata(IS_PUBLIC_KEY, state);
