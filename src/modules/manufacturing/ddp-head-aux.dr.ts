import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { HeadAux } from './entities/ddp-head-aux';

@ObjectType()
export class HeadAuxResponse extends DataResponse(HeadAux) {}
