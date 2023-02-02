import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_PAID_DATE_V')
@ObjectType()
export class PaidDateView extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @Column({ name: 'FROM_CIRCULATION_DATE' })
  fromCirculationDate!: Date;

  @Field()
  @Column({ name: 'UNTIL_CIRCULATION_DATE' })
  untilCirculationDate!: Date;

  @Field()
  @Column({ name: 'PAID_DATE' })
  paidDate!: Date;

  @Field()
  @Column({ name: 'EXPEDITION_NAME' })
  expeditionName!: string;

  @Field()
  @Column({ name: 'PLANT' })
  plant!: string;

  @Field()
  @Column({ name: 'PAID_BY' })
  paidBy!: string;

  @Field({ nullable: true })
  @Column({ name: 'TYPE' })
  type?: string;

  @Field({ nullable: true })
  @Column({ name: 'METHOD' })
  method?: string;

  @Field({ nullable: true })
  @Column({ name: 'PERIODE_BAYAR' })
  periodeBayar?: string;
}
