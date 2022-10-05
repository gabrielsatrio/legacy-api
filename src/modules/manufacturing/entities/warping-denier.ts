import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_PROD_WARPING_DENIER')
@ObjectType()
export class ProdWarpingDenier extends BaseEntity {
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
}
