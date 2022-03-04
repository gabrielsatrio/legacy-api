import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GIO_MOQ')
@ObjectType()
export class Moq extends BaseEntity {
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
  @Column({ name: 'MIN_QTY' })
  minQty!: number;

  @Field({ nullable: true })
  @Column({ name: 'ROW_ID' })
  rowId?: string;
}
