import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { MaterialUse } from './entities/ddp-material-use';

@ObjectType()
export class MaterialUseResponse extends DataResponse(MaterialUse) {}
