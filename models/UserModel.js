import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { strict: 'throw' });

userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR));
    user.password = await bcrypt.hash(user.password, salt);

    next();
})

userSchema.methods.verifyPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

export default mongoose.model('User', userSchema);