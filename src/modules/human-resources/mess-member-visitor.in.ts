import { Field, InputType } from 'type-graphql';
import { MessMemberVisitor } from './entities/mess-member-visitor';

@InputType()
export class MessMemberVisitorInput implements Partial<MessMemberVisitor> {
  @Field()
  id_form!: number;
  @Field()
  mess!: string;
  @Field()
  nama!: string;
  @Field()
  lama_menginap!: number;
  @Field()
  total!: number;
  @Field()
  insert_by!: string;
}
