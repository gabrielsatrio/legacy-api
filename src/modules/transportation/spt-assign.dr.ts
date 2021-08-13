import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { Assign } from './entities/spt-assign';

@ObjectType()
export class AssignResponse extends DataResponse(Assign) {}
