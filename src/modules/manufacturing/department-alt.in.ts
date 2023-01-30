import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { DepartmentAlt } from './entities/deparment-alt';

@InputType()
export class DepartmentAltInput implements Partial<DepartmentAlt> {
  @Field()
  @MaxLength(10)
  departmentId!: string;

  @Field()
  @MaxLength(50)
  description!: string;

  @Field()
  @MaxLength(10)
  parentId!: string;
}
