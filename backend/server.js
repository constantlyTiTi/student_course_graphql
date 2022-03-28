require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const express_graphql = require('express-graphql');
const cors = require("cors");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const courseSchema = require('./schema/courseSchema')
const studentSchema = require('./schema/studentSchema')
const serverSchema = require('./schema/serverSchema')
// const { ApolloServer, gql } = require('apollo-server-express')
// const typeDefs = require('./schema/typeDefs')
// const resolvers = require('./schema/resolvers')
// const jwt = require('express-jwt')
// const authMiddleware = jwt({
//     secret: "place secret here either pass as env",
//     credentialsRequired: false,
// )};

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connect to database'))

const app = express()
// const apolloServer = new ApolloServer({
//     typeDefs,
//     resolvers,
// })
// await apolloServer.start()
// Use the 'body-parser' and 'method-override' middleware functions
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(methodOverride());
// app.use(express.json())
// app.use('*', cors());
// app.use('/graphql/course', cors(), express_graphql.graphqlHTTP({
//     schema: courseSchema,
//     rootValue: global,
//     graphiql: true
// }))
// app.use('/graphql/auth', express_graphql.graphqlHTTP({
//     schema: studentSchema,
//     rootValue: global,
//     graphiql: true
// }))
// app.use('/graphql/student', express_graphql.graphqlHTTP({
//     schema: studentSchema,
//     rootValue: global,
//     graphiql: true
// }))
app.use('/graphql', cors(), express_graphql.graphqlHTTP({
    schema: serverSchema,
    rootValue: global,
    graphiql: true
}))
app.listen(5000, () => console.log('Server Started'))
module.exports = app;