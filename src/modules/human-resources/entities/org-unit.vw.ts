import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_UNIT_V')
@ObjectType()
export class OrgUnitView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'UNIT' })
  unit!: string;
}
