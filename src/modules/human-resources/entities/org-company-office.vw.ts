import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity('VKY_COMPANY_OFFICE_V')
@ObjectType()
export class CompanyOfficeView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'COMPANY_OFFICE' })
  companyOffice!: string;
}
