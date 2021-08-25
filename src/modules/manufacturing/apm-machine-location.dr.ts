import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { MachineLocationView } from './entities/apm-machine-location.vw';

@ObjectType()
export class MachineLocationResponse extends DataResponse(
  MachineLocationView
) {}
