import { Link, Navigate } from "react-router-dom";
import {
  Button,
  Navbar,
  Container,
  Card,
  Row,
  Col,
  Modal,
  Alert,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { addUser } from "../slices/userSlice";
import { useDispatch } from "react-redux";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import "../style/style.css";

function Home() {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({});
  const [isRefresh, setIsRefresh] = useState(false);
  const [post, setPost] = useState([]);
  const [postToDelete, setPostToDelete] = useState();

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setPostToDelete(null);
    setShowModal(false);
  };
  const handleShowModal = (e, post) => {
    console.log("ini log");
    e.preventDefault();
    setPostToDelete(post);
    setShowModal(true);
  };

  const [successResponse, setSuccessResponse] = useState({
    isSuccess: false,
    message: "",
  });

  const [errorResponse, setErrorResponse] = useState({
    isError: false,
    message: "",
  });

  useEffect(() => {
    // Function validasi user
    const validateLogin = async () => {
      try {
        const token = localStorage.getItem("token");

        const currentUserRequest = await axios.get(
          "https://be-instagram-web.herokuapp.com/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const currentUserResponse = currentUserRequest.data;

        if (currentUserResponse.status) {
          dispatch(
            addUser({
              user: currentUserResponse.data.user,
              token: token,
            })
          );
          setUser(currentUserResponse.data.user);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    validateLogin();
    posts();
    setIsRefresh(false);
  }, [isRefresh]);

  // function logout
  const logout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setUser({});
  };

  // function getAll postingan
  const posts = async () => {
    try {
      const dataPosts = await axios.get(
        `https://be-instagram-web.herokuapp.com/api/posts`
      );

      const payloadData = await dataPosts.data.data.getDataAll;

      setPost(payloadData);
    } catch (err) {
      console.log(err);
    }
  };

  // function Delete Postingan
  const onDelete = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const createRequest = await axios.delete(
        `https://be-instagram-web.herokuapp.com/posts/${postToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const successResponse = createRequest.data.message;

      setSuccessResponse({
        isSuccess: true,
        message: successResponse,
      });

      console.log(createRequest);
      setPostToDelete(null);
      setShowModal(false);

      setIsRefresh(true);
    } catch (err) {
      console.log(err);

      const response = err.response.data;

      setErrorResponse({
        isError: true,
        message: response.message,
      });
    }
  };

  return isLoggedIn ? (
    <div className="p-3 bg-all">
      {/* response success or error */}
      {successResponse.isSuccess && (
        <Alert
          variant="success"
          onClose={() => setSuccessResponse(true)}
          dismissible
        >
          {successResponse.message}
        </Alert>
      )}

      {errorResponse.isError && (
        <Alert
          variant="danger"
          onClose={() => setErrorResponse(true)}
          dismissible
        >
          {errorResponse.message}
        </Alert>
      )}

      {/* navbar */}
      <Navbar className=" bg-all">
        <Container>
          <div>
            <p className="bg-nav fw-bold mt-3 ms-3">Welcome {user.name}!</p>
          </div>
          <Button
            className="myButton2"
            variant="danger"
            onClick={(e) => logout(e)}
          >
            LOGOUT
          </Button>
          <Navbar.Toggle />
        </Container>
      </Navbar>
      <div className="row">
        <Link style={{ marginLeft: "115px" }} to="/about">
          <Button className="myButton" variant="success">
            ABOUT
          </Button>
          <Link style={{ marginLeft: "50px" }} to="/create">
            <Button className="myButton" variant="primary">
              CREATE
            </Button>
          </Link>
        </Link>
      </div>

      {/* card */}
      <Container>
        <Row>
          {post.map((post) => (
            <Col md={4} key={post.id}>
              <Card
                className="shadow text-black"
                style={{
                  marginTop: "2rem",
                  borderRadius: "px",
                }}
                border="white"
              >
                <img
                  src={`https://be-instagram-web.herokuapp.com/files/${post.picture}`}
                  alt=""
                  style={{
                    height: "250px",
                    width: "100%",
                    paddingBottom: "15%",
                    maxWidth: "100%",
                  }}
                />
                <div className="card-body">
                  <p className="card-text fw-bold text-center">{post.title}</p>
                  <p className="card-text text-center">{post.description}</p>
                  <Link to={`/update/${post.id}`}>
                    <Button className="myButton5" variant="warning">
                      <BsFillPencilFill /> EDIT
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="myButton2 ms-3"
                    onClick={(e) => handleShowModal(e, post)}
                  >
                    <BsFillTrashFill /> DELETE
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* modals */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button className="myButton3" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button className="myButton4" onClick={(e) => onDelete(e)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default Home;
