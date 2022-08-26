import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_IMPT_LC_V')
@ObjectType()
export class LcChargesView extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field({ nullable: true })
  @Column({ name: 'LC_CHARGES' })
  lcCharges?: string;

  @Field({ nullable: true })
  @Column({ name: 'CURRENCY' })
  currency?: string;

  @Field({ nullable: true })
  @Column({ name: 'AMOUNT' })
  amount?: number;

  @Field({ nullable: true })
  @Column({ name: 'PAID_DATE' })
  paidDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'PAID_BY' })
  paidBy?: string;

  @Field()
  @Column({ name: 'IMPT_ID' })
  imptId!: number;
}
