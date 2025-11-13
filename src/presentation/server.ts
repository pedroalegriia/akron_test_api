import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import eventRoutes from './http/routes/eventRoutes';
import ticketRoutes from './http/routes/ticketRoutes';
import ErrorHandler from './middlewares/ErrorHandler';
import { initDb } from '../infrastructure/database/connection';
import config from '../config/env';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

export const createApp = async () => {
  await initDb();
  const app = express();

  app.use(cors());
  app.use(express.json());

  // REST routes
  app.use('/api/events', eventRoutes);
  app.use('/api/tickets', ticketRoutes);

  // Apollo GraphQL
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();
  app.use('/graphql', expressMiddleware(apolloServer));

  // Error handler
  app.use(ErrorHandler);

  return app;
};

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    const app = await createApp();
    app.listen(config.port, () => {
      console.log(`API running on http://localhost:${config.port}`);
      console.log(`GraphQL endpoint running on http://localhost:${config.port}/graphql`);
    });
  })();
}

export default createApp();
