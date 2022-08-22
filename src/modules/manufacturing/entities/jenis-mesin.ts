import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CHR_JENIS_MESIN_AT2')
@ObjectType()
export class JenisMesinAt2 extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @PrimaryColumn({ name: 'MESIN' })
  mesin!: string;

  @Field({ nullable: true })
  @Column({ name: 'JENIS' })
  jenis?: string;

  @Field({ nullable: true })
  @Column({ name: 'OBJ_ID' })
  objId?: string;
}
