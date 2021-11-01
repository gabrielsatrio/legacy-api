import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_SPT_LOCK_REQUISITION')
@ObjectType()
export class LockRequisition extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'STATUS' })
  status!: string;
}
