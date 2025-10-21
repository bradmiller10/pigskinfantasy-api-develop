import { Inject } from '@nestjs/common';

export const InjectEntity = (entity) => Inject(entity['name']);
