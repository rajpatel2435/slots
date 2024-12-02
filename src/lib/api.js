export const prerender = true;

import { GRAPHQL_ENDPOINT } from "../data/endpoints";
import { getCachedData, setCachedData } from "../lib/cache.js";

// Helper function to decode base64 and extract term ID
function decodeBase64(base64String) {
  try {
    // Decode base64
    const decodedString = atob(base64String);
    // Extract the term ID after "term:"
    const termId = decodedString.split(":")[1];
    return termId;
  } catch (e) {
    console.error("Error decoding base64 string:", base64String, e);
    return null;
  }
}

export async function GuideSidebar() {
  const graphQLResponse = await fetch(GRAPHQL_ENDPOINT, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query GuideSidebar {
            sectionsBasepress(first: 100, where: {parent: 14}) {
              edges {
                node {
                  id
                  name
                  basepress(first: 100) {
                    edges {
                      node {
                        title
                        uri
                      }
                    }
                  }
                }
              }
            }
          }
          `,
    }),
  });

  const { data: graphQLData } = await graphQLResponse.json();

  // Fetch basepress positions from custom REST API
  const restResponse = await fetch(
    "https://slotsparadise.com/wp-json/custom/v1/positions"
  );
  const positionsData = await restResponse.json();

  // Convert positionsData to a map for easier access
  const positionMap = positionsData.reduce((acc, pos) => {
    acc[pos.term_id] = parseInt(pos.basepress_position, 10);
    return acc;
  }, {});

  // Merge the GraphQL data with basepress_position from the custom API
  const sections = graphQLData.sectionsBasepress.edges.map((section) => {
    const termId = decodeBase64(section.node.id);
    //if not found then default set to 9999
    const basepress_position =
      positionMap[termId] !== undefined ? positionMap[termId] : 9999;

    return {
      ...section.node,
      basepress_position,
    };
  });

  // Sort sections by basepress_position
  sections.sort((a, b) => {
    if (a.basepress_position === 9999) return 1;
    if (b.basepress_position === 9999) return -1;
    return a.basepress_position - b.basepress_position;
  });

  return sections;
}

export async function CasinoGuidesArticles() {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query CasinoGuidePage {
            sectionsBasepress(first: 100, where: {parent: 14}) {
              edges {
                node {
                  name
                  uri
                  basepress(first: 6) {
                    edges {
                      node {
                        title
                        uri
                      }
                      cursor
                    }
                    pageInfo {
                      endCursor
                      hasNextPage
                    }
                  }
                  count
                }
              }
            }
          }
          `,
    }),
  });
  const { data } = await response.json();
  return data;
}

export async function getNodeByURI(uri) {
  const cacheKey = `nodeByUri:${uri}`; //  cache key using the URI
  const cachedData = getCachedData(cacheKey); // Retrieve cached data
  if (cachedData) {
    return cachedData;
  } else {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query GetNodeByURI($uri: String!) {
  generalSettings {
    title
    url
  }
  nodeByUri(uri: $uri) {
    __typename
    isContentNode
    isTermNode
    ... on Post {
      id
      title
      date
      uri
      slug
      excerpt
      author {
        node {
          name
          id
          avatar {
            url
          }
        }
      }
      content
      categories {
        nodes {
          name
          uri
        }
      }
      featuredImage {
        node {
          srcSet
          sourceUrl
          altText
          mediaDetails {
            height
            width
          }
        }
      }
      seo {
        metaDesc
        metaTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
          mimeType
          author {
            node {
              name
            }
          }
        }
        proSchemasManual
        proSchemas
      }
    }
    ... on Page {
      id
      title
      uri
      slug
      date
      content
      author {
        node {
          name
          id
          avatar {
            url
          }
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      seo {
        canonicalUrl
        metaDesc
        metaTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
          mimeType
          author {
            node {
              name
            }
          }
        }
      }
    }
    ... on Category {
      id
      name
      slug
      uri
      children {
        edges {
          node {
            name
            posts {
              edges {
                node {
                  title
                  uri
                  excerpt
                  featuredImage {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
      seo {
        metaDesc
        metaTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
          mimeType
          author {
            node {
              name
            }
          }
        }
      }
    }
    ... on Basepress {
      id
      title
      uri
      slug
      date
      databaseId
      content
      author {
        node {
          name
          id
          avatar {
            url
          }
        }
      }
      seo {
        metaDesc
        metaTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
          mimeType
          author {
            node {
              name
            }
          }
        }
      }
    }
    ... on SectionBasepress {
      id
      name
      slug
      uri
      
      basepress(first: 100) {
        edges {
          node {
            title
            uri
          }
        }
      }
      seo {
        metaDesc
        metaTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
          mimeType
          author {
            node {
              name
            }
          }
        }
      }
      count
    }
  }
}
          `,
        variables: {
          uri: uri,
        },
      }),
    });
    const { data } = await response.json();

    setCachedData(cacheKey, data); // Cache the fetched data
    return data;
  }
}

export async function getAllUris() {
  let uris = [];

  // Initial cursor for pagination
  let postCursor = null;

  do {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        query GetAllUris($postCursor: String) {
          terms {
            nodes {
              uri
            }
          }
          posts(first: 1000, after: $postCursor) {
            pageInfo {
              endCursor
              hasNextPage
            }
            nodes {
              uri
            }
          }
          pages(first: 1000) {
            nodes {
              uri
            }
          }
          categories(first: 1000) {
            nodes {
              uri
              slug
            }
          }
          allBasepress(first: 1000) {
            nodes {
              uri
              slug
              sectionsBasepress {
                edges {
                  node {
                    name
                    slug
                    uri
                  }
                }
              }
            }
          }
        }
        `,
        variables: {
          postCursor: postCursor,
        },
      }),
    });

    const { data } = await response.json();

    // Extract post URIs and add them to the uris array
    const postNodes = data.posts.nodes || [];
    uris = uris.concat(
      postNodes
        .map((node) => trimURI(node.uri)) // Extract URIs
        .filter((uri) => uri && uri !== "/") // Filter out empty or invalid URIs
        .map((uri) => ({ params: { uri } }))
    );

    // Extract category URIs and add them to the uris array
    const categoryNodes = data.categories.nodes || [];
    uris = uris.concat(
      categoryNodes
        .map((node) => trimURI(node.uri)) // Extract URIs
        .filter((uri) => uri && uri !== "/") // Filter out empty or invalid URIs
        .map((uri) => ({ params: { uri } }))
    );

    // Extract pages URIs and add them to the uris array
    /* const pageNodes = data.pages.nodes || [];
    uris = uris.concat(pageNodes.map((node) => ({ params: { uri: trimURI(node.uri) } })));  */

    // Extract pages URIs and add them to the uris array
    const pageNodes = data.pages.nodes || [];
    uris = uris.concat(
      pageNodes
        .map((node) => trimURI(node.uri)) // Extract URIs
        .filter((uri) => uri && uri !== "/") // Filter out empty or invalid URIs
        .map((uri) => ({ params: { uri } }))
    );

    // Extract Basepress URIs and add them to the uris array
    const basepressNodes = data.allBasepress.nodes || [];
    uris = uris.concat(
      basepressNodes.map((node) => ({ params: { uri: trimURI(node.uri) } }))
    );

    // Extract Basepress Sections URIs and add them to the uris array
    const basepressSectionNodes = basepressNodes.reduce((acc, node) => {
      const sections = node.sectionsBasepress?.edges || [];
      return acc.concat(
        sections.map((section) => ({
          params: {
            uri: trimURI(section.node.uri),
            basepressSlug: trimURI(node.slug),
          },
        }))
      );
    }, []);

    // Filter out empty or invalid URIs before adding them to the uris array
    basepressSectionNodes.forEach((node) => {
      if (node.params.uri && node.params.uri !== "/") {
        uris.push(node);
      }
    });

    // Update the cursor for the next page
    postCursor = data.posts.pageInfo.hasNextPage
      ? data.posts.pageInfo.endCursor
      : null;
  } while (postCursor);

  return uris;
}

// Function to trim URI
function trimURI(uri) {
  return uri.substring(1, uri.length - 1);
}

//function to get All guides for search page , used for searchPage widget

export async function BasepressForSearch() {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query AllVasepressForSearch {
                allBasepress(first: 1000) {
                  edges {
                    node {
                      id
                      title
                      uri
                      excerpt
                      date
                    }
                  }
                }
              }`,
    }),
  });
  const { data } = await response.json();
  return data;
}
