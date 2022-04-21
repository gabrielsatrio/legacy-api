import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('DOP_HEAD')
@ObjectType()
export class IfsDopHeadView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'DOP_ID' })
  dopId!: string;

  @Field()
  @Column({ name: 'CREATE_DATE' })
  createDate!: Date;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field()
  @Column({ name: 'QTY_DEMAND' })
  qtyDemand!: number;
}
