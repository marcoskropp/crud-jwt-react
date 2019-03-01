const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dateOfBirth: String,
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

UserSchema.plugin(mongoosePaginate);

mongoose.model('User', UserSchema);