import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_DEPT_CODE_CATERING_V')
@ObjectType()
export class DeptCodeCateringView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'DEPT_CODE' })
  deptCode!: string;
}
