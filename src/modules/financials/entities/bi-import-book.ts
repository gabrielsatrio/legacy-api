import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_IMPORT_BOOK')
@ObjectType()
export class ImportBook extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field({ nullable: true })
  @Column({ name: 'PO_NUMBER' })
  poNumber?: string;

  @Field({ nullable: true })
  @Column({ name: 'CONTRACT' })
  contract?: string;

  @Field({ nullable: true })
  @Column({ name: 'SUPPLIER_CODE' })
  supplierCode?: string;

  @Field({ nullable: true })
  @Column({ name: 'SUPPLIER_NAME' })
  supplierName?: string;

  @Field()
  @Column({ name: 'GRAND_TOTAL' })
  grandTotal?: number;

  @Field({ nullable: true })
  @Column({ name: 'ACCOUNT_NO' })
  accountNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'TOP' })
  top?: string;

  @Field({ nullable: true })
  @Column({ name: 'LC' })
  lc?: string;

  @Field({ nullable: true })
  @Column({ name: 'LC_NO' })
  lcNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'PAID_BY' })
  paidBy?: string;

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
}
