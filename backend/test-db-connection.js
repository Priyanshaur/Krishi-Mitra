import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing MySQL connection with:');
    console.log('- Host:', process.env.DB_HOST);
    console.log('- User:', process.env.DB_USER);
    console.log('- Database:', process.env.DB_NAME);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
    
    console.log('✅ Connected to MySQL server successfully!');
    
    // Check if database exists
    const [rows] = await connection.execute(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);
    
    if (rows.length > 0) {
      console.log(`✅ Database ${process.env.DB_NAME} exists`);
    } else {
      console.log(`⚠️ Database ${process.env.DB_NAME} does not exist. Creating it...`);
      try {
        await connection.execute(`CREATE DATABASE ${process.env.DB_NAME}`);
        console.log(`✅ Database ${process.env.DB_NAME} created successfully!`);
      } catch (createErr) {
        console.log(`❌ Failed to create database: ${createErr.message}`);
      }
    }
    
    await connection.end();
  } catch (error) {
    console.log('❌ MySQL connection failed:', error.message);
  }
}

testConnection();