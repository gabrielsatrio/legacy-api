import { ObjectType } from 'type-graphql';
import { BaseEntity, Entity } from 'typeorm';

@Entity('GBR_SALESMAN_V')
@ObjectType()
export class Salesman extends BaseEntity {}
