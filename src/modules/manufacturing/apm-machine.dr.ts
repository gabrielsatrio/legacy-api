import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { Machine } from './entities/apm-machine';

@ObjectType()
export class MachineResponse extends DataResponse(Machine) {}
