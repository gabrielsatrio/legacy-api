import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('MANUF_STRUCT_ALTERNATE')
@ObjectType()
export class IfsManufStructAlternateView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'OBJID' })
  objId!: string;

  @Field()
  @Column({ name: 'ALTERNATIVE_NO' })
  alternativeNo!: string;

  @Field()
  @Column({ name: 'STATE' })
  state!: string;
}
