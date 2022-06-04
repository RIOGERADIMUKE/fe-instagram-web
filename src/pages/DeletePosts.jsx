import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function DeletePosts() {
    const navigate = useNavigate();
    const { id } = useParams();

    const onDelete = async (e) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `https://be-instagram-web.herokuapp.com/posts/${id}`,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            navigate("/")
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        onDelete();
    }, [])
    return (
        <div>
            
        </div>
    )
}