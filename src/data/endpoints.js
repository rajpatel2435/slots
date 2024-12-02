
import dotenv from 'dotenv';
import path from 'path';

const envTEST = process.env.NODE_ENV === 'development' ? './.env.development' : './.env.production';

dotenv.config({ path: path.resolve(process.cwd(), envTEST) });

export const [GRAPHQL_ENDPOINT, ADMIN_AJAX_ENDPOINT] = [
  process.env.GRAPHQL_ENDPOINT,
  process.env.ADMIN_AJAX_ENDPOINT
];