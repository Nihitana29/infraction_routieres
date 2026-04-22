const mongoose = require('mongoose')

/* istanbul ignore next */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
    }
}

module.exports = connectDB