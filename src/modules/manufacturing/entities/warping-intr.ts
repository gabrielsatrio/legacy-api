import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_PROD_WARPING_INTR')
@ObjectType()
export class ProdWarpingIntr extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'KODE_GANGGUAN' })
  kodeGangguan!: string;

  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'DESKRIPSI' })
  deskripsi!: string;
}
