
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('../models/Item'); 

// Load env 
dotenv.config({ path: './.env' });

// Sample data
const sampleItems = [
    { 
        name: 'Modern Laptop', 
        category: 'Electronics', 
        price: 1250, 
        imageUrl: '/assets/images/laptop.jpg' 
    },
    { 
        name: 'Wireless Mouse', 
        category: 'Electronics', 
        price: 50, 
        imageUrl: '/assets/images/mouse.jpg'
    },
    { 
        name: 'Novel', 
        category: 'Books', 
        price: 22, 
        imageUrl: '/assets/images/novel.jpg' 
    },
    { 
        name: 'Cookbook', 
        category: 'Books', 
        price: 30, 
        imageUrl: '/assets/images/cookbook.jpg' 
    },
    { 
        name: 'T-Shirt', 
        category: 'Clothing', 
        price: 25, 
        imageUrl: '/assets/images/t-shirt.jpg' 
    },
    { 
        name: ' Blue Jeans', 
        category: 'Clothing', 
        price: 80, 
        imageUrl: '/assets/images/jeans.jpg'
    }
];

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Import data into DB
const importData = async () => {
    try {
        await Item.deleteMany();
        await Item.insertMany(sampleItems);
        console.log(' Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(` Error: ${error}`);
        process.exit(1);
    }
};

// Destroy data from DB
const destroyData = async () => {
    try {
        await Item.deleteMany();
        console.log(' Data Destroyed Successfully!');
        process.exit();
    } catch (error) {
        console.error(` Error: ${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}