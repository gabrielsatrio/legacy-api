import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { Machine } from './entities/apm-mach-rob';

@ObjectType()
export class MachineResponse extends DataResponse(Machine) {}
