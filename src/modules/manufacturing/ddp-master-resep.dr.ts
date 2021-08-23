import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { MasterResep } from './entities/ddp-master-resep';

@ObjectType()
export class ResepResponse extends DataResponse(MasterResep) {}
