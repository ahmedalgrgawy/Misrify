import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    }, password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    phoneNumber: {
        type: Number,
        required: [true, "Phone number is required"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male",
    },
    role: {
        type: String,
        enum: ["user", "admin", "merchant"],
        default: "user",
    },
    imgUrl: {
        type: String
    },
    points: {
        type: Number,
        default: 0
    },
    purchaseHistory: {
        type: Array,
        default: []
    },
    recommendedProduct: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            default: []
        }
    ],
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema)

export default User;