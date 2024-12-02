import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the chosen .env file
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Ensure GRAPHQL_ENDPOINT is set in process.env
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
console.log("endpoint is", GRAPHQL_ENDPOINT);

export default defineConfig({
  integrations: [tailwind()],
  base: "/",
  trailingSlash: "always",
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  server: {
    port: 4321,
    host: "127.0.0.1",
  },
  GRAPHQL_ENDPOINT: GRAPHQL_ENDPOINT
});
