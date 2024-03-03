const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://jojosehrawat21:2nb82EUacxSpf9T7@cluster0.r4yw3jl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
mongoose.connect('mongodb+srv://jojosehrawat21:2nb82EUacxSpf9T7@cluster0.r4yw3jl.mongodb.net/Drawing-App');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

const drawingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    elementsArray: {
        type: Array,
        required: true
    },
    title:{
        type: String
    },
    created: {
        type: String
    },
    image: {
        type: String,
    }
});

const Drawing = mongoose.model('Drawing', drawingSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
	User,
    Drawing,
};
