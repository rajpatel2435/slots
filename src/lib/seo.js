export const prerender = true;
import { getCachedData, setCachedData } from '../lib/cache.js';
import { GRAPHQL_ENDPOINT } from "../data/endpoints";
// Define a mapping of URI patterns to their transformed equivalents
const uriTransformations = {
  'casino/slots': 'casino/casino_slots',
  'casino/jackpot-games': 'casino/casino_jackpot-games',
  'casino/video-poker': 'casino/casino_video-poker',
  'casino/table-games': 'casino/casino_table-games',
  'casino/roulette': 'casino/casino_roulette',
  'casino/blackjack': 'casino/casino_blackjack',
  'casino/live-dealer': 'casino/casino_live-dealer',
};

export async function seoNodeByURI(uri) {
  const cacheKey = `seoNodeByUri:${uri}`;
  const cachedData = getCachedData(cacheKey);

  if (cachedData) {
    return cachedData;
  }
  try {
    Object.entries(uriTransformations).forEach(([key, value]) => {
      if (uri.includes(key)) {
        uri = uri.replace(key, value);
      }
    });

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
  query 
  seoUri($uri: String!) {
   generalSettings {
    title
    url
  }
  nodeByUri(uri: $uri) {
    __typename
    ... on Page {
      id
      title
      uri
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
      slug
      date
      featuredImage {
        node {
          srcSet
          sourceUrl
          altText
          mimeType
          caption
          mediaDetails {
            height
            width
          }
        }
      }
      modified
      seo {
        canonicalUrl
        opengraphTitle
        metaRobotsBreadcrumbs
        hasProLicense
        metaDesc
        proSchemasManual
        metaRobotsNofollow
        metaRobotsNoindex
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
    ... on Post {
      id
      title
      content
      uri
      author {
        node {
          name
          id
          avatar {
            url
          }
        }
      }
      slug
      date
      modified
      featuredImage {
        node {
          srcSet
          sourceUrl
          altText
          mimeType
          caption
          mediaDetails {
            height
            width
          }
        }
      }
      seo {
        proSchemas
        opengraphTitle
        metaRobotsBreadcrumbs
        canonicalUrl
        metaDesc
        metaRobotsNofollow
        metaRobotsNoindex
        metaTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
          mimeType
          author {
            node {
              name
              id
            }
          }
        }
      }
    }
    ... on Category {
      id
      name
      uri
      slug
      seo {
        opengraphTitle
        metaRobotsBreadcrumbs
        canonicalUrl
        metaDesc
        metaRobotsNofollow
        metaRobotsNoindex
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
    ... on Tag {
      id
      name
      uri
      seo {
        opengraphTitle
        metaRobotsBreadcrumbs
        canonicalUrl
        metaDesc
        metaRobotsNofollow
        metaRobotsNoindex
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
      uri
      slug
      title
      date
      featuredImage {
        node {
          srcSet
          sourceUrl
          altText
          mimeType
          caption
          mediaDetails {
            height
            width
          }
        }
      }
      modified
      seo {
        opengraphTitle
        opengraphImage {
          sourceUrl
          mimeType
          author {
            node {
              name
            }
          }
        }
        metaDesc
        metaTitle
        metaRobotsNoindex
        metaRobotsNofollow
        metaRobotsBreadcrumbs
      }
    }
    ... on SectionBasepress {
      id
      name
      uri
      slug
      description
      seo {
        metaDesc
        metaTitle
        metaRobotsNofollow
        metaRobotsNoindex
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
  }
}
            `,
        variables: {
          uri: uri,
        },
      }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const { data } = await response.json();

    // Cache the fetched data
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return null; // Return null or handle the error in an appropriate way
  }
}
