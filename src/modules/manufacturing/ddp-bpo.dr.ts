import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { DDPBPO } from './entities/ddp-bpo';

@ObjectType()
export class BPOResponse extends DataResponse(DDPBPO) {}
