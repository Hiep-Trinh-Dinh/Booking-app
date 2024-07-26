const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    place: {type:mongoose.Schema.Types.ObjectId, require:true, ref:'Place'},
    user: {type:mongoose.Schema.Types.ObjectId, require:true},
    nameplace: {type:String, require:true},
    name: {type:String, require:true},
    phone: {type:String, require:true},
    number: {type:Number, require:true},
    address: {type:String, require:true},
    price: Number,
});

const bookingModel = mongoose.model('Booking', bookingSchema);
module.exports = bookingModel;
