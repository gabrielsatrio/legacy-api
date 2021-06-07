import { Field, ObjectType } from 'type-graphql';
import FieldDeleteData from './FieldDeleteData';
import FieldError from './FieldError';

const DataDeleteResponse = (): any => {
  @ObjectType({ isAbstract: true })
  abstract class DataResponseClass {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => FieldDeleteData, { nullable: true })
    data?: FieldDeleteData;
  }
  return DataResponseClass;
};

export default DataDeleteResponse;
