import React, { useContext } from "react";
import { Card, Icon, Label, Image, Button, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

const PostCard = ({
  post: {
    id,
    body,
    comment,
    createdAt,
    username,
    likesCount,
    commentsCount,
    likes,
  },
}) => {
  const { user } = useContext(AuthContext);
  const commentOnPost = () => console.log("commented");
  console.log(createdAt);
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ likes, id, likesCount }} />
        <Popup
          content="Comment on post"
          inverted
          trigger={
            <Button
              labelPosition="right"
              as={Link}
              to={`/posts/${id}`}
              onClick={commentOnPost}
            >
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
          <DeleteButton postId={id} callBack={""} />
        )}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
