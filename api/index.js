const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

require('dotenv').config()

cloudinary.config({
    cloud_name: 'digj9t8om', 
    api_key: '852875261613694', 
    api_secret: 'TaDwpWj1Mx-VXCGye9OqIql1IYA' 
});

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET || 'fasefraw4r5r3wq45wdfqw34twdfq';
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || 'https://booking-app-nn9w.onrender.com',
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));


function getUserDataFromToken(req){
    return new Promise((resolve, reject) =>{
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        });
    });
}

app.get('/test', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    res.json('test ok');
});


app.post('/register', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {name, email, password} = req.body;

    try{
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    } catch(e){
        res.status(422).json(e);
    }
});

app.post('/login', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {email, password} = req.body;
    const userDoc = await User.findOne({email});
    if(userDoc){
       const passOK = bcrypt.compareSync(password, userDoc.password)
       if(passOK){
        jwt.sign({email:userDoc.email, id:userDoc._id}, jwtSecret, {}, (err,token) => {
            if(err) throw err;
            res.cookie('token', token).json(userDoc);
        });
       } else {
        res.status(422).json('pass not ok');
       }
    } else {
        res.status(422).json('not found');
    }
});

app.get('/profile', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if(err) throw err;
            const {name,email,_id} = await User.findById(userData.id);
            res.json({name,email,_id});
        });
    } else {
        res.json(null);
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {link} =req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' +newName,
    });
    res.json(newName);
});

const photosMiddleware = multer({dest:'uploads'});
app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
    const uploadedFiles = [];
    for(let file of req.files){
        try {
            const result = await cloudinary.uploader.upload(file.path);
            uploadedFiles.push(result.secure_url);
            fs.unlinkSync(file.path); // Xóa file tạm sau khi upload
        } catch (error) {
            console.error('Lỗi khi upload ảnh lên Cloudinary:', error);
        }
    }
    res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    const {
        title,address,addedPhotos,description,price,
        extraInfo,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if(err) throw err;
        const placeDoc = await Place.create({
            owner:userData.id,price,
            title,address,photos:addedPhotos,description,
            extraInfo,
        });
        res.json(placeDoc);
    });
});

app.get('/user-places', (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const {id} = userData;
        res.json(await Place.find({owner:id}));
    });
});

app.get('/places/:id', async (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {id} = req.params;
    res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    extraInfo,price,
  } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        extraInfo,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/places', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    res.json( await Place.find());
});

app.post('/bookings', async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    const userData = await getUserDataFromToken(req);
    const {
        place, nameplace, name, phone, number, address, price,
    } = req.body; 
    Booking.create({
        place, nameplace, name, phone, number, address, price,
        user:userData.id,
    }).then((doc) => {
        res.json(doc);
    }).catch((err) => {
        throw err;
    });
});



app.get('/bookings', async (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
    const userData = await getUserDataFromToken(req)
    res.json(await Booking.find({user:userData.id}).populate('place'));
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//c6GqcFTtFFM2Et10