import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_DEPARTMENT_V')
@ObjectType()
export class DepartmentView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'DEPARTMENT_ID' })
  departmentId!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field()
  altDescription(): string {
    return `${this.description} (${this.departmentId})`;
  }
}
