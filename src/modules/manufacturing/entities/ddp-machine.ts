import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CHR_DDT_MACH_TAB')
@ObjectType()
export class DDPMachine extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'MESIN' })
  mesin!: string;

  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'TYPE' })
  type!: string;

  @Field()
  @Column({ name: 'FORMAT_ANGKA' })
  angka!: string;
}
