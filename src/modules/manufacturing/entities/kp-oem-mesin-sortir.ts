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
}
