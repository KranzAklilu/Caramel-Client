import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Button, Icon, Label, Popup } from "semantic-ui-react";

export default function LikeButton({ user, post: { id, likes, likesCount } }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  const likedButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );
  return (
    <Button as="div" labelPosition="right" onClick={likePost}>
      <Popup
        content={liked ? "Unlike" : "Like"}
        inverted
        trigger={likedButton}
      />
      <Label basic color="teal" pointing="left">
        {likesCount}
      </Label>
    </Button>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation createLike($postId: ID!) {
    likePost(postId: $postId) {
      id
      username
      likes {
        id
        username
      }
      likesCount
    }
  }
`;
