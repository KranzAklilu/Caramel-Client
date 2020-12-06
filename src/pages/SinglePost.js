import React, { useContext, useRef, useState } from "react";
import gql from "graphql-tag";
import moment from "moment";

import { useMutation, useQuery } from "@apollo/client";
import {
  Icon,
  Label,
  Button,
  Popup,
  Card,
  Grid,
  Image,
  Form,
} from "semantic-ui-react";
import { AuthContext } from "../context/auth";

import LikeButton from "../components/LikeButton";
import DeletePost from "../components/DeleteButton";

const SinglePost = (props) => {
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;

  const { loading, data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });
  const getPost = loading ? null : data.getPost;

  const [comment, setComment] = useState("");

  const commentInputRef = useRef(null);

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  const deletePost = function () {
    props.history.push("/");
  };

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading Posts...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      commentsCount,
      likesCount,
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              floated="right"
              size="mini"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likesCount }} />
                <Popup
                  content="Comment on post"
                  inverted
                  trigger={
                    <Button as="div" labelPosition="right">
                      <Button basic color="teal">
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="blue" pointing="left">
                        {commentsCount}
                      </Label>
                    </Button>
                  }
                />
                {user && username === user.username && (
                  <DeletePost postId={id} callBack={deletePost} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment, index) => (
              <Card fluid key={index}>
                <Card.Content>
                  <Card.Content>
                    {user && user.username === comment.username && (
                      <DeletePost postId={postId} commentId={comment.id} />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
};
const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
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
      username
    }
  }
`;
const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        username
        createdAt
      }
      commentsCount
    }
  }
`;

export default SinglePost;
