import { Field, InputType } from 'type-graphql';
import { DisabledEmployees } from './entities/disabled-employee';

@InputType()
export class DisabledEmployeesInput implements Partial<DisabledEmployees> {
  @Field()
  employeeId!: string;
}
