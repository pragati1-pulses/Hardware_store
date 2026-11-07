const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const seedUsers = async () => {
    try {
        // 1. Check if ANY users already exist in the database
        const userCount = await User.count();
        
        // 2. If users already exist, do nothing (prevents duplicate errors)
        if (userCount > 0) {
            console.log('👤 Users already exist. Skipping user seeder.');
            return;
        }

        // 3. If the database is empty, create the default users
        console.log('🌱 Seeding default users...');
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        await User.bulkCreate([
            {
                name: 'Owner Sir',
                email: 'sir@buildmart.com',
                password: hashedPassword,
                role: 'super_admin'
            },
            {
                name: 'Store Admin',
                email: 'admin@buildmart.com',
                password: hashedPassword,
                role: 'admin'
            },
            {
                name: 'Cashier Staff',
                email: 'staff@buildmart.com',
                password: hashedPassword,
                role: 'staff'
            }
        ]);

        console.log('✅ Default users seeded successfully! You can now log in.');
    } catch (error) {
        console.error('❌ Error seeding users:', error);
    }
};

module.exports = seedUsers;