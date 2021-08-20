import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { BPOAuxiliaries } from './entities/ddp-bpo-auxiliaries';

@ObjectType()
export class BPOAuxiliariesResponse extends DataResponse(BPOAuxiliaries) {}
