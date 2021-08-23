import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { Vehicle } from './entities/spt-vehicle';

@ObjectType()
export class VehicleResponse extends DataResponse(Vehicle) {}
