import dayjs from 'dayjs';
import { GraphQLScalarType } from 'graphql';
import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';

const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'GraphQLDate is a date type for GraphQL',
  // Would be called when the value of the type is going to be sent to the
  // client as a response. Since the values on the output is in the form of
  // JSON, the return value of serialize could be anything. Could be string,
  // number, array, object.
  serialize(value) {
    const date = dayjs(value);
    if (!date.isValid()) {
      throw new GraphQLError(
        'serialize: require date with format "YYYY-MM-DD" found: ' + value
      );
    }
    return date.format('YYYY-MM-DD');
  },
  // Read client input where the value is JSON.
  parseValue(value) {
    const val = value.toString();
    const date = dayjs(val, 'YYYY-MM-DD');
    if (!date.isValid()) {
      throw new GraphQLError(
        'parseValue: require date with format "YYYY-MM-DD" found: ' + val
      );
    }
    return val;
  },
  // Read client input where the value is AST.
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        'parseLiteral: require date with format "YYYY-MM-DD" found: ' +
          ast.kind,
        [ast]
      );
    }
    const val = ast.value.toString();
    const date = dayjs(val, 'YYYY-MM-DD');
    if (!date.isValid()) {
      throw new GraphQLError(
        'parseLiteralB: require date with format "YYYY-MM-DD" found: ' + val
      );
    }
    return val;
  }
});

const GraphQLDateTime = new GraphQLScalarType({
  name: 'GraphQLDateTime',
  description: 'GraphQLDateTime is a custom datetime type for GraphQL',
  serialize(value) {
    const datetime = dayjs(value);
    if (!datetime.isValid()) {
      throw new GraphQLError(
        'serialize: require datetime with format "YYYY-MM-DD HH:mm:ss" found: ' +
          value
      );
    }
    return datetime.format('YYYY-MM-DD HH:mm:ss');
  },
  parseValue(value) {
    const val = value.toString();
    const date = dayjs(val, 'YYYY-MM-DD HH:mm:ss');
    if (!date.isValid()) {
      throw new GraphQLError(
        'parseValue: require date with format "YYYY-MM-DD HH:mm:ss" found: ' +
          val
      );
    }
    return val;
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        'parseLiteral: require date with format "YYYY-MM-DD HH:mm:ss" found: ' +
          ast.kind,
        [ast]
      );
    }
    const val = ast.value.toString();
    const date = dayjs(val, 'YYYY-MM-DD HH:mm:ss');
    if (!date.isValid()) {
      throw new GraphQLError(
        'parseLiteralB: require date with format "YYYY-MM-DD HH:mm:ss" found: ' +
          val
      );
    }
    return val;
  }
});

export { GraphQLDate, GraphQLDateTime };
