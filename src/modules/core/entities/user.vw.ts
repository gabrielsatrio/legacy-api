import { toArray } from '@/utils/to-array';
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_APP_USER_V')
@ObjectType()
export class UserView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'USERNAME' })
  username!: string;

  @Field()
  @Column({ name: 'NAME' })
  name!: string;

  @Field()
  @Column({ name: 'PASSWORD' })
  password!: string;

  @Field()
  @Column({ name: 'EMAIL' })
  email!: string;

  @Field()
  @Column({ name: 'DEPARTMENT_ID' })
  departmentId!: string;

  @Field()
  @Column({ name: 'DEPARTMENT' })
  department!: string;

  @Field({ nullable: true })
  @Column({ name: 'DEPARTMENT_ALT' })
  departmentAlt!: string;

  @Field()
  @Column({ name: 'USERNAME_DB' })
  usernameDb!: string;

  @Field()
  @Column({ name: 'IFS_USERNAME' })
  ifsUsername!: string;

  @Field({ nullable: true })
  @Column({ name: 'DEFAULT_CONTRACT' })
  defaultContract?: string;

  @Field({ nullable: true })
  @Column({ name: 'ALLOWED_CONTRACT' })
  allowedContract?: string;

  @Field()
  @Column({ name: 'FORCE_CHG_PASSW' })
  forceChgPassw!: number;

  @Field()
  @Column({ name: 'STATUS' })
  status!: string;

  @Field()
  @Column({ name: 'CREATED_AT' })
  createdAt!: Date;

  @Field()
  @Column({ name: 'UPDATED_AT' })
  updatedAt!: Date;

  @Field()
  @Column({ name: 'OBJ_ID' })
  objId!: string;

  @Field(() => [String])
  contract(): string[] | number[] {
    return toArray(this.allowedContract || '', ';');
  }
}
