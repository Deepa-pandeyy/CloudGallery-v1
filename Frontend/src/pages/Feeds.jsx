import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

import LogoutButton from "../components/LogoutButton";
import style from "./Feeds.module.css";

const Feeds = () => {
  const [posts, setPosts] = useState([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/getpost");
      setPosts(res.data.posts);
    } catch (err) {
      console.log(err);
    }
  };

  const deletePost = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/post/${id}`);

      setPosts((prev) => prev.filter((post) => post._id !== id));

      alert("Post deleted successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete post.");
    }
  };

  const handleEdit = async (post) => {
    const newCaption = prompt("Edit your caption", post.caption);

    if (!newCaption || newCaption.trim() === "") return;

    try {
      await API.put(`/post/${post._id}`, {
        caption: newCaption,
      });

      setPosts((prev) =>
        prev.map((item) =>
          item._id === post._id
            ? { ...item, caption: newCaption }
            : item
        )
      );

      alert("Post updated successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Update failed.");
    }
  };

  return (
    <section className={style.feedSection}>
      <div className={style.topBar}>
        <div>
          <h1 className={style.pageTitle}>CloudGallery</h1>

          <p className={style.pageSubtitle}>
            Fresh moments from your gallery
          </p>

          {user && (
            <p className={style.author}>
              Welcome, <strong>{user.name}</strong>
            </p>
          )}
        </div>

        <div className={style.topBarActions}>
          <Link
            to="/createPost"
            className={style.createLink}
          >
            Create Post
          </Link>

          <LogoutButton
            className={style.logoutButton}
          >
            Logout
          </LogoutButton>
        </div>
      </div>

      {posts.length > 0 ? (
        <div className={style.postsGrid}>
          {posts.map((post) => (
            <article
              key={post._id}
              className={style.Card}
            >
              <div className={style.imageWrapper}>
                <img
                  src={post.image}
                  alt={post.caption}
                  className={style.image}
                />
              </div>

              <div className={style.cardBody}>
                <p className={style.para}>
                  {post.caption}
                </p>

                {post.createdBy && (
                  <p className={style.author}>
                    By {post.createdBy.name}
                  </p>
                )}

                {user &&
                  post.createdBy &&
                  user._id === post.createdBy._id && (
                    <div className={style.actionButtons}>
                      <button
                        className={style.editBtn}
                        onClick={() =>
                          handleEdit(post)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className={style.deleteBtn}
                        onClick={() =>
                          deletePost(post._id)
                        }
                      >
                        🗑 Delete
                      </button>
                    </div>
                  )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={style.emptyState}>
          <h2 className={style.heading}>
            No posts available yet
          </h2>

          <p className={style.emptyText}>
            Create your first post and start sharing your
            memories.
          </p>
        </div>
      )}
    </section>
  );
};

export default Feeds;