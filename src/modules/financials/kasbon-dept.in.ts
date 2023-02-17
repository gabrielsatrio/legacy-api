import { Field, InputType } from 'type-graphql';
import { DeptKasbon } from './entities/kasbon-dept';

@InputType()
export class DeptKasbonInput implements Partial<DeptKasbon> {
  @Field()
  department!: string;
}
