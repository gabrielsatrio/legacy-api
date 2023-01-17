import { Field, InputType } from 'type-graphql';
import { MasterJabatan } from './entities/master-jabatan';

@InputType()
export class MasterJabatanInput implements Partial<MasterJabatan> {
  @Field()
  kode!: string;

  @Field()
  jabatan!: string;
}
