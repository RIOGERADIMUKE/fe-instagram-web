import React, { useEffect ,useRef, useState } from "react";
import { Form, Container, Button, Alert, Row } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const titleField = useRef("");
  const descriptionField = useRef("");
  const [picturePost, setPictureField] = useState();
  const { id } = useParams();

  const [data, setData] = useState([]);

  const [errorResponse, setErrorResponse] = useState({
    isError: false,
    message: "",
  });

  const onUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const userToUpdatePayload = new FormData();
      userToUpdatePayload.append("title", titleField.current.value);
      userToUpdatePayload.append("description", descriptionField.current.value);
      userToUpdatePayload.append("picture", picturePost);

      const updateRequest = await axios.put(
          `https://be-instagram-web.herokuapp.com/posts/${id}`, userToUpdatePayload, {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
          },
      }
      );
      const updateResponse = updateRequest.data;

      if (updateResponse.status) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      const response = err.response.data;

      setErrorResponse({
        isError: true,
        message: response.message,
      });
    }
  };

  const getPosts = async () => {
    try {

        const responsePosts = await axios.get(`https://be-instagram-web.herokuapp.com/api/posts/${id}`)

        const dataPosts = await responsePosts.data.data.getdata;

        setData(dataPosts)
        console.log(dataPosts);
    } catch (err) {
        console.log(err);
    }
}

useEffect(() => {
    getPosts();
}, [])

  return (
    <Container className="my-5 w-50">
      <h1 className="mb-3 text-center">Update Post</h1>
      <Form onSubmit={onUpdate}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control 
          type="text" 
          ref={titleField} 
          defaultValue={data.title}
          placeholder="Title" />
          
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            type="text"
            ref={descriptionField}
            defaultValue={data.description}
            placeholder="Description"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Row>
          <img src={`https://be-instagram-web.herokuapp.com/public/files/${data.picture}`} alt="" style={{ }} />
          </Row>
          <Form.Label>Picture</Form.Label>
          <Form.Control
            type="file"
            ref={picturePost}
            onChange={(e) => setPictureField(e.target.files[0])}
          />
        </Form.Group>
        {errorResponse.isError && (
          <Alert variant="danger">{errorResponse.message}</Alert>
        )}
        <div className="d-flex justify-content-center">
          <Button type="submit">Submit</Button>
          <Link to="/">
            <Button type="submit" variant="outline-secondary" className="ms-3">
              Cancel
            </Button>
          </Link>
        </div>
      </Form>
    </Container>
  );
}