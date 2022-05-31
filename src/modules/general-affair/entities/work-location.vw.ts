import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('EMP_WORK_LOCATION_V')
@ObjectType()
export class WorkLocationView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'WORK_LOCATION' })
  workLocation!: string;
}
