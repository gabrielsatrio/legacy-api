import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { HeadDye } from './entities/ddp-head-dye';

@ObjectType()
export class HeadDyeResponse extends DataResponse(HeadDye) {}
