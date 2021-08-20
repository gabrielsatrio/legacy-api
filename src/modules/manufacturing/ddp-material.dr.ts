import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { Material } from './entities/ddp-material';

@ObjectType()
export class MaterialResponse extends DataResponse(Material) {}
