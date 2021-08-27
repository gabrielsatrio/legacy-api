import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { MachineCategoryView } from './entities/apm-machine-category.vw';

@ObjectType()
export class MachineCategoryResponse extends DataResponse(
  MachineCategoryView
) {}
