import gql from "graphql-tag";
export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      username
      body
      comments {
        id
        username
        body
        createdAt
      }
      likes {
        id
        username
        createdAt
      }
      commentsCount
      likesCount
      createdAt
    }
  }
`;
