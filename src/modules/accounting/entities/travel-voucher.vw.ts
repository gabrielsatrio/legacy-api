import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_TRAVEL_V')
@ObjectType()
export class TravelVoucherView extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'CONTRACT' })
  contract!: string;

  @Field({ nullable: true })
  @Column({ name: 'DEPT' })
  dept?: string;

  @Field()
  @Column({ name: 'NOMINAL' })
  nominal!: number;

  @Field({ nullable: true })
  @Column({ name: 'NO_ACCOUNT' })
  noAccount?: string;

  @Field({ nullable: true })
  @Column({ name: 'VOUCHER_NO_TEMP' })
  voucherNoTemp?: string;

  @Field({ nullable: true })
  @Column({ name: 'VOUCHER_NO' })
  voucherNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'NOTE' })
  note?: string;

  @Field()
  @Column({ name: 'CLAIM_NO' })
  claimNo!: string;
}
