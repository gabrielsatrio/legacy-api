import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { HeadResep } from './entities/ddp-head-resep';

@ObjectType()
export class HeadResepResponse extends DataResponse(HeadResep) {}
