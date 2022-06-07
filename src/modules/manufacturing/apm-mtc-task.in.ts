import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { MtcTask } from './entities/apm-mtc-task';

@InputType()
export class MtcTaskInput implements Partial<MtcTask> {
  @Field()
  @MaxLength(500)
  description!: string;

  @Field()
  @MaxLength(10)
  type!: string;

  @Field({ nullable: true })
  @MaxLength(10)
  uom?: string;

  @Field()
  @MaxLength(8)
  status!: 'Active' | 'Inactive';
}
