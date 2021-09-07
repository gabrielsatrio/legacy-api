import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ROB_TRANS_TO_KUAN_MAP')
@ObjectType()
export class MappingKuans extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'RACK_ID' })
  rackId!: string;

  @Field()
  @Column({ name: 'RACK_DESCRIPTION' })
  rackDescription!: string;

  @Field()
  @Column({ name: 'ACTIVE_STATUS' })
  activeStatus!: string;

  @Field({ nullable: true })
  @Column({ name: 'LAMP_NO' })
  lampNo?: number;

  @Field({ nullable: true })
  @Column({ name: 'PWD_TYPE' })
  pwdType?: string;

  @Field({ nullable: true })
  @Column({ name: 'PWD_KIND' })
  pwdKind?: string;

  @Field({ nullable: true })
  @Column({ name: 'PWD_CONC' })
  pwdConc?: string;

  @Field({ nullable: true })
  @Column({ name: 'COLOR_NAME' })
  colorName?: string;

  @Field({ nullable: true })
  @Column({ name: 'OLD_CONTRACT' })
  oldContract?: string;

  @Field({ nullable: true })
  @Column({ name: 'OLD_PART_NO' })
  oldPartNo?: string;

  @Field({ nullable: true })
  @Column({ name: 'ID_TABLE' })
  objId?: string;
}
