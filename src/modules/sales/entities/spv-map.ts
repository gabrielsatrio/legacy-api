import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ATJ_SPV_MAP')
@ObjectType()
export class SpvMap extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'USERID' })
  userid!: string;

  @Field()
  @PrimaryColumn({ name: 'SALESMAN_CODE' })
  salesmanCode!: string;

  @Field({ nullable: true })
  @Column({ name: 'ROWVERSION' })
  rowversion?: Date;

  @Field({ nullable: true })
  @Column({ name: 'GRADE' })
  grade?: string;
}
