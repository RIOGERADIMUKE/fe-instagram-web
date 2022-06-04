import { Link, Navigate } from "react-router-dom";
import { Button, Alert, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { addUser } from "../slices/userSlice";
import { useDispatch } from "react-redux";
import { BsFillTrashFill, BsFillPencilFill} from "react-icons/bs";
import "../style/style.css";


function Home() {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({});

  const [data, setData] = useState([]);

  
  useEffect(() => {

    const fetchData = async () => {
      try {
        // Check status user login
        // 1. Get token from localStorage
        const token = localStorage.getItem("token");

        // 2. Check token validity from API
        const currentUserRequest = await axios.get(
          "http://localhost:2000/auth/me",
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
          )
          setUser(currentUserResponse.data.user);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    fetchData();
    posts();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setUser({});
  };

  const posts = async () => {
    try {
      const dataPosts = await axios.get(
        `http://localhost:2000/api/posts`
      )

      const payloadData = await dataPosts.data.data.getDataAll;

      setData(payloadData)
    } catch (err) {
      console.log(err);
    }
  }
  

  return isLoggedIn ? (
    <div className="p-3">
      <Alert>Selamat datang {user.name}</Alert>
      <div>

      </div>
      <Link to="/about">
        <Button variant="success">About</Button>
      </Link>
      <Link className="ms-5" to="/create">
        <Button variant="primary">Create</Button>
      </Link>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Picture</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.title}</td>
              <td>{data.description}</td>
              <td><img className="w-25" src={`http://localhost:2000/public/files/${data.picture}`}/></td>
              <td><Link className="ms-5" to={`/update/${data.id}`}>
                <Button variant="warning"> <BsFillPencilFill/> Edit</Button>
              </Link>
              <Link className="ms-5" to={`/delete/${data.id}`}>
             
                <Button variant="danger"> <BsFillTrashFill/> Delete</Button>
              </Link>
              </td>
            </tr>
          ))}
        </tbody>
        <Button className="nav-logout my-3" variant="danger" onClick={(e) => logout(e)}>
        Logout
      </Button>
      </Table>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default Home;