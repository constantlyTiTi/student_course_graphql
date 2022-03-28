const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema, GraphQLBoolean, GraphQLInt } = require('graphql');
const studentType = require('./studentType');

const authType = new GraphQLObjectType({
    name: 'auth',
    fields: () => ({
        student: {
            type: studentType
        },
        message: {
            type: GraphQLString
        },
        success: {
            type: GraphQLBoolean
        },
        token: {
            type: GraphQLString
        }
    })
});
module.exports = authType