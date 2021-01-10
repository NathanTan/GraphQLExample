var express = require('express');
var { graphqlHTTP, expressGraphQL } = require('express-graphql');
// const expressGraphQL = require('express-graphql')
var { buildSchema, GraphQLSchema, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

/* 
 * Example Query: {
      units {
        id,
        name,
        dps
      }
    }
 *
 */

const players = [
  { id: 1, name: "Serral", nationality: "Forginer", race: "Zerg" },
  { id: 2, name: "Dark", nationality: "Korean", race: "Zerg" },
  { id: 3, name: "Reynor", nationality: "Forginer", race: "Zerg" },
]

const units = [
  { id: 1, name: "Marine", dps: 1000, unitType: "Ground", race: "Terran" },
  { id: 2, name: "Roach", dps: 5, unitType: "Ground", race: "Zerg" },
  { id: 3, name: "Tempest", dps: 500, unitType: "Air", race: "Protoss" }
]

const schema2 = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'helloworld',
    fields: () => ({
      message: {
        type: GraphQLString,
        resolve: () => 'hello World'
      }
    })
  })
})

const UnitType = new GraphQLObjectType({
  name: 'Unit',
  description: 'A controllable unit',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    dps: { type: GraphQLNonNull(GraphQLInt) },
    unitType: { type: GraphQLNonNull(GraphQLString) },
    race: { type: GraphQLNonNull(GraphQLString) },
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'QueryType',
  description: "Root Query",
  fields: () => ({
    units: {
      type: new GraphQLList(UnitType),
      description: 'List of units',

      // This is where you would query the db
      resolve: () => units
    }
  })
})

const schema3 = new GraphQLSchema({
  query: RootQueryType
})



var root = { hello: () => 'Hello world!' };

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema3,
  rootValue: root,
  graphiql: true,
}));
// app.use('/graphql', expressGraphQL({
//   schema: schema3,
//   graphqli: true
// }))

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
