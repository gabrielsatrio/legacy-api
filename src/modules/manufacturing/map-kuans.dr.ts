import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { MappingKuans } from './entities/map-kuans';

@ObjectType()
export class MappingResponse extends DataResponse(MappingKuans) {}
