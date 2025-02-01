const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

bcrypt.hash('1234', saltRounds, (error, hash) => {
    if (error) {
        console.error("Error hashing password:", error);
        process.exit(1); // Exit the process with an error code
    } else {
        console.log("Hashed password:", hash);

        const SQL_STATEMENT = `
            -- Drop all tables if they exist
            DROP TABLE IF EXISTS UserPets;
            DROP TABLE IF EXISTS Review;
            DROP TABLE IF EXISTS Inventory;
            DROP TABLE IF EXISTS Shop;
            DROP TABLE IF EXISTS Quests;
            DROP TABLE IF EXISTS Pets;
            DROP TABLE IF EXISTS UserCompletion;
            DROP TABLE IF EXISTS FitnessChallenge;
            DROP TABLE IF EXISTS User;

            -- Create User Table
            CREATE TABLE User (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                username TEXT NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,      -- Unique email for login
                password VARCHAR(255) NOT NULL,          -- Hashed password
                skillpoints INT DEFAULT 0,               -- Default skill points
                is_admin BOOLEAN DEFAULT FALSE,          -- Determines if the user is an admin
                created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Create FitnessChallenge Table
            CREATE TABLE FitnessChallenge (
                challenge_id INT AUTO_INCREMENT PRIMARY KEY,
                creator_id INT NOT NULL,                 -- User who created the challenge
                challenge TEXT NOT NULL,                 -- Challenge description
                skillpoints INT NOT NULL,                -- Skill points reward
                FOREIGN KEY (creator_id) REFERENCES User(user_id) -- Links to User
            );

            -- Create UserCompletion Table
            CREATE TABLE UserCompletion (
                complete_id INT AUTO_INCREMENT PRIMARY KEY,
                challenge_id INT NOT NULL,
                user_id INT NOT NULL,
                completed BOOL NOT NULL,
                creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                notes TEXT,
                FOREIGN KEY (challenge_id) REFERENCES FitnessChallenge(challenge_id), -- Links to FitnessChallenge
                FOREIGN KEY (user_id) REFERENCES User(user_id) -- Links to User
            );

            -- Create Pets Table
            CREATE TABLE Pets (
                pet_id INT AUTO_INCREMENT PRIMARY KEY,
                pet_name TEXT NOT NULL,
                species TEXT NOT NULL,
                happiness_level INT DEFAULT 0 NOT NULL,  -- Happiness starts at 0
                cost_in_skillpoints INT NOT NULL         -- Cost defined by creator
            );

            -- Create UserPets Table
            CREATE TABLE UserPets (
                user_pet_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each user-pet relationship
                user_id INT NOT NULL, -- Links to the User table
                pet_id INT NOT NULL, -- Links to the Pets table
                purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the pet was purchased
                custom_name TEXT DEFAULT NULL, -- Allow users to rename their pets
                happiness_level INT DEFAULT 0, -- Happiness level for the specific user-pet relationship
                FOREIGN KEY (user_id) REFERENCES User(user_id), -- Ensure valid user ID
                FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) -- Ensure valid pet ID
            );

            -- Create Quests Table
            CREATE TABLE Quests (
                quest_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                pet_id INT NOT NULL,
                quest TEXT NOT NULL,
                reward INT NOT NULL,
                status TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES User(user_id), -- Links to User
                FOREIGN KEY (pet_id) REFERENCES Pets(pet_id) -- Links to Pets
            );

            -- Create Shop Table
            CREATE TABLE Shop (
                item_id INT AUTO_INCREMENT PRIMARY KEY,
                item_name VARCHAR(100) NOT NULL,         -- Name of the item
                effect_happiness INT DEFAULT 0,          -- Happiness increase from the item
                price INT NOT NULL                       -- Cost in skill points
            );

            -- Create Inventory Table
            CREATE TABLE Inventory (
                inventory_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                item_id INT NOT NULL,
                quantity INT DEFAULT 1 NOT NULL,
                FOREIGN KEY (user_id) REFERENCES User(user_id), -- Links to User
                FOREIGN KEY (item_id) REFERENCES Shop(item_id) -- Links to Shop
            );

            -- Create Review Table
            CREATE TABLE Review (
                review_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                challenge_id INT NOT NULL,
                review TEXT NOT NULL,
                rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5), -- Rating 1 to 5
                created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES User(user_id), -- Links to User
                FOREIGN KEY (challenge_id) REFERENCES FitnessChallenge(challenge_id) -- Links to FitnessChallenge
            );

            -- Insert Initial Data into Tables
            INSERT INTO User (username, email, password, is_admin) VALUES
            ('admin', 'admin@example.com', '${hash}', TRUE),
            ('user1', 'user1@example.com', '${hash}', FALSE),
            ('user2', 'user2@example.com', '${hash}', FALSE);

            INSERT INTO FitnessChallenge (creator_id, challenge, skillpoints) VALUES
            (1, 'Complete 2.4km within 15 minutes', 50),
            (1, 'Cycle around the island for at least 50km', 100),
            (2, 'Complete a full marathon (42.2km)', 200),
            (2, 'Hold a plank for 5 minutes', 50),
            (2, 'Perform 100 push-ups in one session', 75);

            INSERT INTO Pets (pet_name, species, happiness_level, cost_in_skillpoints) VALUES
            ('Fluffy', 'Dog', 0, 100),
            ('Sparky', 'Parrot', 0, 80),
            ('Whiskers', 'Cat', 0, 90),
            ('Buddy', 'Rabbit', 0, 70),
            ('Goldy', 'Fish', 0, 50),
            ('Shadow', 'Horse', 0, 120),
            ('Coco', 'Turtle', 0, 60);

            INSERT INTO Shop (item_name, effect_happiness, price) VALUES
            ('Happiness Potion', 10, 50),
            ('Toy Ball', 15, 100),
            ('Comfort Blanket', 20, 150),
            ('Super Snack', 25, 200),
            ('Golden Leash', 30, 300),
            ('Mystery Box', 50, 500),
            ('Energy Drink', 5, 25),
            ('Pet Trainer Manual', 40, 400);
        `;

        pool.query(SQL_STATEMENT, (error, results) => {
            if (error) {
                console.error("Error creating tables:", error);
            } else {
                console.log("Tables created and data inserted successfully.");
            }
            process.exit();
        });
    }
});
