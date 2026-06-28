import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import style from "./CreatePost.module.css";

const CreatePost = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const image = formData.get("image");

    if (!image || image.size === 0) {
      alert("Please select an image.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/createpost", formData);

      alert("Post uploaded successfully!");

      e.target.reset();

      navigate("/feed");
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={style.container}>
      <h1 className={style.heading}>Create Post</h1>

      <form
        onSubmit={handleSubmit}
        className={style.text}
        encType="multipart/form-data"
      >
        <input
          className={style.image}
          type="file"
          name="image"
          accept="image/*"
          required
        />

        <input
          className={style.caption}
          type="text"
          name="caption"
          placeholder="Enter the caption here..."
          required
        />

        <button
          className={style.button}
          type="submit"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </section>
  );
};

export default CreatePost;