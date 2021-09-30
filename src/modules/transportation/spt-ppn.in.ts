import { Field, InputType } from 'type-graphql';
import { PPN } from './entities/spt-ppn';

@InputType()
export class PPNInput implements Partial<PPN> {
  @Field()
  expeditionId!: string;

  @Field()
  ppn!: string;
}
