import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useForm } from "../utils/hooks";
import { AuthContext } from "../context/auth";

export default function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(login, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(error) {
      setErrors(error.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });
  function login() {
    loginUser();
  }

  return (
    <div className="form-container">
      <Form className={loading ? "loading" : ""} onSubmit={onSubmit} noValidate>
        <h1>Login</h1>
        <Form.Input
          label="User Name"
          placeholder="username"
          name="username"
          value={values.username}
          onChange={onChange}
          error={errors.username}
        />
        <Form.Input
          label="Password"
          placeholder="password"
          type="password"
          name="password"
          value={values.password}
          onChange={onChange}
          error={errors.password}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message form-contianer">
          <ul className="list">
            {Object.values(errors).map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      createdAt
      username
      token
    }
  }
`;
