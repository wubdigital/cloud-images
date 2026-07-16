require("dotenv").config();
const express = require("express");
const multer = require("multer");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { randomUUID } = require("crypto");
const app = express();
const PORT = 3000;
console.log("Testing ENV variables:");
console.log("Access Key:", process.env.AWS_ACCESS_KEY_ID);
console.log("Bucket:", process.env.S3_BUCKET);
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const BUCKET = process.env.S3_BUCKET;
const upload = multer({ storage: multer.memoryStorage() });
const posts = [];

app.use(express.static("public"));

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const unique = randomUUID() + "_" + req.file.originalname;
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: unique,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      }),
    );

    posts.unshift({ unique, description: req.body.description });
    res.status(201).json({ message: "uploudes to S3 successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
