import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_DEPT_KASBON')
@ObjectType()
export class DeptKasbon extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'DEPARTMENT' })
  department!: string;
}
