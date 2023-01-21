import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_PROD_WARPING_DENIER_V')
@ObjectType()
export class ProdWarpingDenierView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: number;

  @Field()
  @Column({ name: 'JUMLAH_LUSI' })
  jumlahLusi!: string;

  @Field()
  @Column({ name: 'DENIER' })
  denier!: string;

  @Field()
  @Column({ name: 'JUMLAH_BOBIN' })
  jumlahBobin!: number;

  @Field()
  @Column({ name: 'OBJID' })
  objid!: string;
}
