import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('CHR_AFAL_BRAIDING')
@ObjectType()
export class AfalBraiding extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'TANGGAL' })
  tanggal!: Date;

  @Field()
  @PrimaryColumn({ name: 'CONTRACT' })
  contract!: string;

  @Field()
  @Column({ name: 'PP' })
  pp!: number;

  @Field()
  @Column({ name: 'POLYESTER' })
  polyester!: number;

  @Field()
  @Column({ name: 'PVC' })
  pvc!: number;

  @Field({ nullable: true })
  @Column({ name: 'OBJ_ID' })
  objId?: string;
}
