
CREATE DATABASE IF NOT EXISTS edi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE edi;

-- ensure InnoDB (required for foreign keys)
SET default_storage_engine=InnoDB;

-- 2. Users Table
CREATE TABLE users (
    id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'farmer',
    profile VARCHAR(255),
    phone VARCHAR(20),
    rating FLOAT DEFAULT 5.0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Market Items Table
CREATE TABLE market_items (
    id CHAR(36) NOT NULL,
    sellerId CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    unit ENUM('kg','quintal','ton','bag','piece') DEFAULT 'kg',
    quantity INT NOT NULL,
    category ENUM('cereals','pulses','vegetables','fruits','spices','others') NOT NULL,
    qualityGrade ENUM('premium','grade-a','grade-b','standard') DEFAULT 'standard',
    organic BOOLEAN DEFAULT FALSE,
    harvestDate DATETIME,
    status ENUM('active','sold','inactive') DEFAULT 'active',
    location_city VARCHAR(255),
    location_state VARCHAR(255),
    location_pincode VARCHAR(20),
    tags JSON,
    images JSON,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_market_seller FOREIGN KEY (sellerId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Diagnoses Table
CREATE TABLE diagnoses (
    id CHAR(36) NOT NULL,
    userId CHAR(36) NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    cropType VARCHAR(255) NOT NULL,
    prediction_disease VARCHAR(255),
    prediction_confidence FLOAT,
    prediction_scientificName VARCHAR(255),
    prediction_commonName VARCHAR(255),
    severity VARCHAR(50) DEFAULT 'low',
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_diagnoses_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Orders Table
CREATE TABLE orders (
    id CHAR(36) NOT NULL,
    buyerId CHAR(36) NOT NULL,
    sellerId CHAR(36) NOT NULL,
    totalAmount DECIMAL(10,2) NOT NULL,
    status ENUM('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
    paymentStatus ENUM('pending','paid','failed','refunded') DEFAULT 'pending',

    shipping_street VARCHAR(255),
    shipping_city VARCHAR(255),
    shipping_state VARCHAR(255),
    shipping_pincode VARCHAR(20),
    shipping_contactNumber VARCHAR(20),

    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_orders_buyer FOREIGN KEY (buyerId) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_seller FOREIGN KEY (sellerId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Order Items Table
CREATE TABLE order_items (
    id CHAR(36) NOT NULL,
    orderId CHAR(36) NOT NULL,
    itemId CHAR(36) NOT NULL,
    title VARCHAR(255),
    price DECIMAL(10,2),
    quantity INT,
    unit VARCHAR(50),
    PRIMARY KEY (id),
    CONSTRAINT fk_orderitems_order FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_orderitems_item FOREIGN KEY (itemId) REFERENCES market_items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Chats Table
CREATE TABLE chats (
    id CHAR(36) NOT NULL,
    userId CHAR(36) NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    sessionId VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_chats_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 1. Ensure columns exist (Ignore errors if they already exist)
ALTER TABLE users ADD COLUMN googleId VARCHAR(255) UNIQUE DEFAULT NULL;
ALTER TABLE users ADD COLUMN location VARCHAR(255) DEFAULT NULL;
ALTER TABLE users ADD COLUMN bio TEXT DEFAULT NULL;

-- 2. Allow NULL passwords (Required for Google Login)
ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL;

-- 3. Check if your user actually exists
SELECT * FROM users;