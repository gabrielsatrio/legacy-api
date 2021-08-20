import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { MachineView } from './entities/apm-machine.vw';

@ObjectType()
export class MachineResponse extends DataResponse(MachineView) {}
