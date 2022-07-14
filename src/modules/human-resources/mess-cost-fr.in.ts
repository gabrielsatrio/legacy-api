import { Field, InputType } from 'type-graphql';
import { MessCostFixRate } from './entities/mess-cost-fr';

@InputType()
export class MessCostInput implements Partial<MessCostFixRate> {
  @Field({ nullable: true })
  id?: number;
  @Field()
  mess!: string;
  @Field()
  subsidi_tdl!: number;
  @Field()
  subsidi_bea_beban!: number;
  @Field()
  subsidi_bea_adm!: number;
  @Field()
  tamu_perusahaan!: number;
  @Field()
  tamu_pribadi!: number;
  @Field()
  internet!: number;
  @Field()
  created_by!: string;
}
