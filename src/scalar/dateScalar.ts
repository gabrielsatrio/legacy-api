import { GraphQLScalarType, Kind } from 'graphql';
import moment from 'moment';

export const CustomDateScalar = new GraphQLScalarType({
  name: 'Osas',
  description: 'Tanggal Ateja',
  serialize(value: any): any {
    // ini yg muncul di playground
    if (typeof value !== 'object') {
      throw new Error('Osas can only parse object values');
    }
    return moment(value).format('L');
  },
  parseValue(value: unknown): any {
    if (typeof value !== 'string') {
      throw new Error('Osas can only parse string values');
    }

    return value;
  },
  parseLiteral(ast): any {
    if (ast.kind !== Kind.STRING) {
      throw new Error('Osas can only parse string values');
    }
    return ast.value;
  }
});
