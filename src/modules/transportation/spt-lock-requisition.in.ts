import { Field, InputType } from 'type-graphql';
import { LockRequisition } from './entities/spt-lock-requisition';

@InputType()
export class LockRequisitionInput implements Partial<LockRequisition> {
  @Field()
  status!: string;
}
