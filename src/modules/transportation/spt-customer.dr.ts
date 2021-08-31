import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { Customer } from './entities/spt-customer';

@ObjectType()
export class CustomerResponse extends DataResponse(Customer) {}
