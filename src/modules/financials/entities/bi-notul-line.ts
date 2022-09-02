import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_IMPT_NOTUL_LINE')
@ObjectType()
export class NotulLine extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field({ nullable: true })
  @Column({ name: 'PIB_ITEMS' })
  pibItems?: string;

  @Field({ nullable: true })
  @Column({ name: 'AMOUNT_IDR' })
  amountIdr?: number;

  @Field()
  @Column({ name: 'NOTUL_ID' })
  notulId!: number;
}
