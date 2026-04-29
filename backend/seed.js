const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        const admin = new User({
            name: 'System Admin',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin',
            isFirstLogin: false
        });

        await admin.save();
        console.log('Admin user created successfully');
        console.log(`Email: ${process.env.ADMIN_EMAIL}`);
        console.log(`Password: ${process.env.ADMIN_PASSWORD}`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
