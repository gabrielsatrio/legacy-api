import { Field, InputType } from 'type-graphql';
import { MessCompanyVisitor } from './entities/mess-company-visitor';

@InputType()
export class MessCompanyVisitorInput implements Partial<MessCompanyVisitor> {
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
