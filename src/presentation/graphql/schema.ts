import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Event {
    id: ID!
    name: String!
    start_date: String!
    end_date: String!
    total_tickets: Int!
    tickets_sold: Int!
    tickets_redeemed: Int!
  }

  type Ticket {
    id: ID!
    code: String!
    event_id: Int!
    is_redeemed: Boolean!
  }

   type ValidationError {
    field: String!
    message: String!
   }

   type DeleteResponse {
    success: Boolean!
    message: String!
    errors: [ValidationError!]!
  }

  type RedeemResponse {
    success: Boolean!
    message: String!
    errors: [ValidationError!]
    ticket: Ticket
  }

  type Query {
    getEvent(id: ID!): Event
    getTicket(code: String!): Ticket
  }

  type Mutation {
    createEvent(name: String!, start_date: String!, end_date: String!, total_tickets: Int!): Event!
    updateEvent(id: ID!, name: String, start_date: String, end_date: String, total_tickets: Int): Event!
    deleteEvent(id: ID!): DeleteResponse!
    sellTicket(eventId: ID!): Ticket!
    redeemTicket(code: String!): RedeemResponse!
  }
`;
