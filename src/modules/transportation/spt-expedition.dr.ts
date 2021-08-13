import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { Expedition } from './entities/spt-expedition';

@ObjectType()
export class ExpeditionResponse extends DataResponse(Expedition) {}
