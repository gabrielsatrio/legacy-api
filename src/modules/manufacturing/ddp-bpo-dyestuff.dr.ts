import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { BPODyestuff } from './entities/ddp-bpo-dyestuff';

@ObjectType()
export class BPODyestuffResponse extends DataResponse(BPODyestuff) {}
