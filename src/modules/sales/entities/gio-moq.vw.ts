import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GIO_MOQ_V')
@ObjectType()
export class MoqView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: string;

  @Field()
  @PrimaryColumn({ name: 'REL_NO' })
  relNo!: string;

  @Field()
  @PrimaryColumn({ name: 'MIN_QTY' })
  minQty!: number;

  @Field({ nullable: true })
  @Column({ name: 'ROW_ID' })
  rowId?: string;
}
