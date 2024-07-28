require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const Place = require('./models/Place'); // Đảm bảo đường dẫn đúng đến model Place

// Cấu hình Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

async function uploadToCloudinary(localPath) {
  try {
    const result = await cloudinary.uploader.upload(localPath);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
}

async function updateImageUrls() {
  const places = await Place.find();

  for (let place of places) {
    const updatedPhotos = [];
    for (let photo of place.photos) {
      if (photo.startsWith('http')) {
        // Nếu ảnh đã là URL (có thể đã là Cloudinary), giữ nguyên
        updatedPhotos.push(photo);
      } else {
        // Nếu ảnh là đường dẫn cục bộ, upload lên Cloudinary
        const localPath = path.join(__dirname, 'uploads', photo);
        if (fs.existsSync(localPath)) {
          const cloudinaryUrl = await uploadToCloudinary(localPath);
          if (cloudinaryUrl) {
            updatedPhotos.push(cloudinaryUrl);
          }
        } else {
          console.warn(`File not found: ${localPath}`);
        }
      }
    }

    // Cập nhật place với các URL mới
    place.photos = updatedPhotos;
    await place.save();
    console.log(`Updated place: ${place._id}`);
  }

  console.log('All places updated');
  mongoose.disconnect();
}

updateImageUrls().catch(console.error);