import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_KP_OEM_MESIN_SORTIR_V')
@ObjectType()
export class KpOemMesinSortirView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'ORDER_NO' })
  orderNo!: string;

  @Field()
  @Column({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @PrimaryColumn({ name: 'LOT_BATCH_NO' })
  lotBatchNo!: string;

  @Field()
  @Column({ name: 'QUANTITY' })
  quantity!: number;

  @Field()
  @Column({ name: 'QTY_OOREC' })
  qtyOorec!: number;

  @Field()
  @Column({ name: 'QTY_SORTIR' })
  qtySortir!: number;

  @Field()
  @Column({ name: 'QTY_OESHIP' })
  qtyOeship!: number;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field()
  @Column({ name: 'CREATED_DATE' })
  createdDate!: Date;

  @Field()
  @Column({ name: 'MODIFIED_DATE' })
  modifiedDate!: Date;
}
