import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('PART_CATALOG')
@ObjectType()
export class IfsPartCatalogView extends BaseEntity {
  @Field()
  @PrimaryColumn({ name: 'PART_NO' })
  partNo!: string;

  @Field()
  @Column({ name: 'DESCRIPTION' })
  description!: string;

  @Field()
  @Column({ name: 'UNIT_CODE' })
  unitCode!: string;

  @Field({ nullable: true })
  @Column({ name: 'INFO_TEXT' })
  infoText?: string;

  @Field()
  altDescription(): string {
    return `${this.description} (${this.partNo})`;
  }
}
