import { BasepressForSearch } from "../lib/api";

async function getPosts() {
  const data = await BasepressForSearch();
  const posts = data.allBasepress.edges.map((edge) => edge.node);

  // Return the mapped posts with required fields
  return posts.map((post) => ({
    uri: post.uri,
    title: post.title,
    excerpt: post.excerpt,
  }));
}

// Define the GET handler
export async function GET() {
  //console.log("API called");
  const posts = await getPosts();
  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
