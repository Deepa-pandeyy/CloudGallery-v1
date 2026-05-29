import React from "react";
import style from "./CreatePost.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await axios
      .post("http://localhost:3000/createPost", formData)
      .then((res) => {
        console.log(res);
        navigate("/feed");
      })
      .catch((err) => {
        console.log(err);
        alert("Error creating post");
      });
  };
  return (
    <>
      <section className={style.container}>
        <h1 className={style.heading}>Create Post</h1>

        <form onSubmit={handleSubmit} className={style.text}>
          <input
            className={style.image}
            type="file"
            name="image"
            accept="image/*"
          />
          <input
            className={style.caption}
            type="text"
            name="caption"
            placeholder="Enter the caption here..."
            required
          />
          <button className={style.button}>Submit</button>
        </form>
      </section>
    </>
  );
};

export default CreatePost;
