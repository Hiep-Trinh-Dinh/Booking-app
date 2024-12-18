const mongoose = require('mongoose');

const placesSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    address: String,
    photos: [String],
    description: String,
    extraInfo: String,
    price: Number,
});

const PlaceModel = mongoose.model('Place', placesSchema);
module.exports = PlaceModel;
