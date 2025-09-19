import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dataFile = "./data/reviews.json";

// 🟢 GET all reviews
app.get("/api/reviews", (req, res) => {
  try {
    const reviews = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to read reviews." });
  }
});

// 🟢 POST a new review
app.post("/api/reviews", (req, res) => {
  const { title, author, review, rating } = req.body;

  // Basic validation
  if (!title || !author || !review) {
    return res.status(400).json({
      error: "Title, author, and review are required fields."
    });
  }

  try {
    const reviews = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    const newReview = {
      id: Date.now(),
      title,
      author,
      review,
      rating: rating || 3, // default 3 if not given
    };

    reviews.push(newReview);
    fs.writeFileSync(dataFile, JSON.stringify(reviews, null, 2));
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: "Failed to save review." });
  }
});

// 🟢 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
