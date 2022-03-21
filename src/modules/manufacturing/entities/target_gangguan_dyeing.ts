import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CHR_TARGET_GANGGUAN')
@ObjectType()
export class TargetGangguan extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @PrimaryColumn({ name: 'WAKTU' })
  waktu!: number;

  @Field()
  @Column({ name: 'METER' })
  meter!: number;

  @Field()
  @Column({ name: 'ROW_ID' })
  rowId!: string;
}
