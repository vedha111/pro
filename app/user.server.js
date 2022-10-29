import { gql, GraphQLClient } from "graphql-request";
import invariant from "tiny-invariant";

invariant(process.env.GITHUB_TOKEN, "GITHUB_TOKEN must be set");

const client = new GraphQLClient("https://api.github.com/graphql", {
  headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
});

const GetUserQuery = gql`
  query ProductPageQuery($login: String!) {
    user(login: $login) {
      url
      login
      name
      avatarUrl(size: 80)
      company
      location
      email
      websiteUrl
      twitterUsername
      bio
      isHireable
      createdAt
      following {
        totalCount
      }
      followers {
        totalCount
      }
      status {
        message
        emojiHTML
      }
      allRepositories: repositories {
        totalCount
      }
      repositories(
        ownerAffiliations: OWNER
        orderBy: { field: STARGAZERS, direction: DESC }
        first: 10
        privacy: PUBLIC
      ) {
        nodes {
          name
          url
          description
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          licenseInfo {
            name
          }
          updatedAt
          repositoryTopics(first: 6) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
    }
  }
`;

export async function getUser(login) {
  const result = await client.request(GetUserQuery, { login });

  return result.user;
}
