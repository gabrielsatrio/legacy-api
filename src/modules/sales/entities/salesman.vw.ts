import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('GBR_SALESMAN_V')
@ObjectType()
export class Salesman extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'DIVISI' })
  divisi!: string;
}
