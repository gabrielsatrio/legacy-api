import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_PROD_WARPING_INTR')
@ObjectType()
export class ProdWarpingIntr extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @PrimaryColumn({ name: 'LINE_NO' })
  lineNo!: number;

  @Field()
  @Column({ name: 'KODE_GANGGUAN' })
  kodeGangguan!: string;

  @Field()
  @Column({ name: 'DURASI' })
  durasi!: number;
}
