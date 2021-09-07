import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CHR_DDP_MAP_TIMBANGAN')
@ObjectType()
export class MapTimbangan extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'USERNAME' })
  userName!: string;

  @Field()
  @Column({ name: 'ADDRESS' })
  address!: string;

  @Field()
  @PrimaryColumn({ name: 'JENIS_TIMBANG' })
  jenisTimbang!: string;
}
