const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
});

// Some environments may load the package as an object with a default property.
const plm = (passportLocalMongoose && passportLocalMongoose.default) ? passportLocalMongoose.default : passportLocalMongoose;
if (typeof plm !== 'function') {
    throw new Error('passport-local-mongoose did not export a plugin function.');
}
userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);