const Imagekit = require("@imagekit/nodejs");

let imagekit = null;

function getImagekit() {
  if (!imagekit) {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("IMAGEKIT_PRIVATE_KEY is not configured");
    }
    imagekit = new Imagekit({ privateKey });
  }
  return imagekit;
}

async function uploadFile(buffer) {
  const client = getImagekit();
  const result = await client.files.upload({
    file: buffer.toString("base64"),
    fileName: `image_${Date.now()}.png`,
  });
  return result;
}

module.exports = uploadFile;