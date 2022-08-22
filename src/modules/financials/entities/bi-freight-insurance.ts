import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_IMPT_FREIGHT_INSURANCE')
@ObjectType()
export class FreightInsurance extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field({ nullable: true })
  @Column({ name: 'NAME' })
  name?: string;

  @Field({ nullable: true })
  @Column({ name: 'INVOICE_NO' })
  invoiceNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'AJU_NO' })
  ajuNo?: string;

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

  @Field({ nullable: true })
  @Column({ name: 'SHIP_CURRENCY' })
  shipCurrency?: string;

  @Field({ nullable: true })
  @Column({ name: 'SHIP_AMOUNT' })
  shipAmount?: number;

  @Field({ nullable: true })
  @Column({ name: 'SHIP_NOTE' })
  shipNote?: string;

  @Field()
  @Column({ name: 'IMPT_ID' })
  imptId!: number;
}
