import React, { useContext } from "react";

import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

const Home = function () {
  const { user } = useContext(AuthContext);

  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row>
        <h1 className="page-title">Recent Post</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading post..</h1>
        ) : (
          <Transition.Group>
            {data.getPosts.map((post, index) => (
              <Grid.Column key={index} style={{ marginBottom: 20 }}>
                <PostCard post={post} />
              </Grid.Column>
            ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
