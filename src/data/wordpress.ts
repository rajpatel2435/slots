export const prerender = true;
import { GRAPHQL_ENDPOINT } from "./endpoints";
interface WPGraphQLParams {
  query: string;
  variables?: object;
}

export async function wpquery({ query, variables = {} }: WPGraphQLParams) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!res.ok) {
    console.log(res);
    return {};
  }

  const { data } = await res.json();

  return data;
}
