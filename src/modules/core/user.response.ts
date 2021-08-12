import DataResponse from '@/types/data-response';
import { ObjectType } from 'type-graphql';
import { User } from './entities/user';

@ObjectType()
export class UserResponse extends DataResponse(User) {}
