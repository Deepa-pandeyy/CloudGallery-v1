const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const uploadFile = require("./service/storage.service");
const postModel = require("./model/postModel");
const userModel = require("./model/userModel");

const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const uploadFile = require("./service/storage.service");
const postModel = require("./model/postModel");
const userModel = require("./model/userModel");

console.log("Password Schema:", userModel.schema.path("password").options);

const authMiddleware = require("./middleware/auth.middleware");
const connectDB = require("./db/db");

const app = express();

app.use(express.json());
app.use(cors());

const upload = multer({
  storage: multer.memoryStorage(),
});

/* ===========================
   SIGNUP
=========================== */
app.post("/signup", async (req, res) => {
  try {
   

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET || "gallery-secret",
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "Signup Successful",
      token,
     user: {
  _id: user._id,
  name: user.name,
  email: user.email,
},
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Signup Failed",
      error: error.message,
    });
  }
});

/* ===========================
   LOGIN
=========================== */
app.post("/login", async (req, res) => {
  try {
    

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET || "gallery-secret",
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
  _id: user._id,
  name: user.name,
  email: user.email,
},
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Login Failed",
      error: error.message,
    });
  }
});

/* ===========================
   PROFILE
=========================== */
app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ===========================
   CREATE POST
=========================== */
app.post(
  "/createpost",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Image is required",
        });
      }

      const result = await uploadFile(req.file.buffer);

      const post = await postModel.create({
        image: result.url,
        caption: req.body.caption,
        createdBy: req.user.id,
      });

      res.status(201).json({
        message: "Post Created Successfully",
        post,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

/* ===========================
   PUBLIC GALLERY
=========================== */
app.get("/getpost", authMiddleware, async (req, res) => {
  try {
    const posts = await postModel
      .find({ createdBy: req.user.id })
      .populate("createdBy", "name email");

    res.status(200).json({
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ===========================
   MY POSTS
=========================== */
app.get("/myposts", authMiddleware, async (req, res) => {
  try {
    const posts = await postModel
      .find({
        createdBy: req.user.id,
      })
      .populate("createdBy", "name email");

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ===========================
   DELETE POST
=========================== */
app.delete("/post/:id", authMiddleware, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      message: "Post Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ===========================
   UPDATE POST
=========================== */
app.put("/post/:id", authMiddleware, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    post.caption = req.body.caption || post.caption;

    await post.save();

    res.status(200).json({
      message: "Post Updated Successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ===========================
   ERROR HANDLER
=========================== */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;