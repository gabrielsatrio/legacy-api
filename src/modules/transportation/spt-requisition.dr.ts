import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { Requisition } from './entities/spt-requisition';

@ObjectType()
export class RequisitionResponse extends DataResponse(Requisition) {}
