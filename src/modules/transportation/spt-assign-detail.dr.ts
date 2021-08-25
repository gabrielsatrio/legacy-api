import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { AssignDetail } from './entities/spt-assign-detail';

@ObjectType()
export class AssignDetailResponse extends DataResponse(AssignDetail) {}
