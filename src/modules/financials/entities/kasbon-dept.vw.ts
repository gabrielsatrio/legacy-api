import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_DEPT_KASBON_V')
@ObjectType()
export class DeptKasbonView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'DEPARTMENT' })
  department!: string;
}
