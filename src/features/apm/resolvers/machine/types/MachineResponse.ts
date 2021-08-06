import DataResponse from '@/types/DataResponse';
import { ObjectType } from 'type-graphql';
import { Machine } from '../../../entities/Machine';

@ObjectType()
export class MachineResponse extends DataResponse(Machine) {}
