import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { Destination } from './entities/spt-destination';

@ObjectType()
export class DestinationResponse extends DataResponse(Destination) {}
