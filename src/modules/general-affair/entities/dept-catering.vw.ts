import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('ANG_DEPT_CATERING_V')
@ObjectType()
export class DeptCateringView extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: 'ID' })
  id!: number;

  @Field()
  @PrimaryColumn({ name: 'DEPT_CODE' })
  deptCode!: string;

  @Field()
  @PrimaryColumn({ name: 'DEPT_NAME' })
  deptName!: string;

  @Field()
  @PrimaryColumn({ name: 'PLANT' })
  plant!: string;
}
