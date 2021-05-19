import { ClassType, Field, ObjectType } from 'type-graphql';
import FieldError from './FieldError';

export default function DataResponse<TItem>(TItemClass: ClassType<TItem>): any {
  @ObjectType({ isAbstract: true })
  abstract class DataResponseClass {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => TItemClass, { nullable: true })
    data?: TItem;
  }
  return DataResponseClass;
}
