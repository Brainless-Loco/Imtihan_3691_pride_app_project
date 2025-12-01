import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import dbConfig from "./db.config.js";

const db = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
}).promise();


/**
 * 
 * @param {Integer} id 
 * @returns JSON object of all user fields
 */
export async function getUserById(id){

    try{
        const [rows] = await db.query(`
            SELECT * FROM users
            WHERE id = ?
            `, [id]);
        
            return rows[0];
    } catch (err){
        throw err;
    }
    
}

/**
 * 
 * @returns Array of JSON objects with all users info
 */
export async function getAllUsers(){
    const [rows] = await db.query(`
    SELECT * FROM users     
    `);

    return rows;
}

/**
 * 
 * @param {String} email,  the users email
 * @param {String} password,  the users password
 * @param {String} phone_number,  the users phone number
 * @param {String} security_question,  the users security question
 * @param {String} security_answer,  the users security answer
 * @returns The id of the newly inserted user
 */
export async function createUser(email, password, phone_number=null, security_question=null, security_answer=null){

    try{
        const hashed_password = await generatePasswordHash(password);
        const [result] = await db.query(`
        INSERT INTO users (email, hashed_password, phone_number, security_question, security_answer)
        VALUES (?, ?, ?, ?, ?)   
        `, [email, hashed_password, phone_number, security_question, security_answer]);

        return result.insertId;
    }

    catch (err){
        if (err.code === "ER_DUP_ENTRY" || err.errno === 1062) {
            const e = new Error("Account with this email already exists");
            e.status = 409;
            throw e;
        }
        err.sattus = err.status || 500

        throw err
    }
    
}

/**
 * 
 * @param {Integer} id the id of the user
 * @returns number of affected rows in the database
 */
export async function removeUserById(id){
    const [result] = await db.query(`
        DELETE FROM users
        WHERE id = ?
    `, [id]);

    return result.affectedRows;
}
/**
 * 
 * @param {String} email <- The users email 
 * @returns JSON object of the user with the matching email
 */
export async function getUserByEmail(email){
    try {
        const [rows] = await db.query(
          `
          SELECT *
          FROM users
          WHERE email = ?
          LIMIT 1
          `,
          [email]
        );
       
        return rows?.[0] ?? null;
    } catch (err) {
        
        err.status = err.status || 500;
        throw err;
    }

    
}

export async function generatePasswordHash(password){
    const hashed_password = await bcrypt.hash(password, 10);
    
    return hashed_password;
}

/**
 * Create a new post
 * @param {Integer} userId - The user creating the post
 * @param {String} content - The post content
 * @param {String} imageUrl - Optional image URL
 * @returns The id of the newly created post
 */
export async function createPost(userId, content, imageUrl = null) {
    try {
        const [result] = await db.query(`
            INSERT INTO posts (user_id, content, image_url)
            VALUES (?, ?, ?)
        `, [userId, content, imageUrl]);

        return result.insertId;
    } catch (err) {
        err.status = err.status || 500;
        throw err;
    }
}

/**
 * Get all posts with user info, ordered by most recent
 * @returns Array of posts with author information
 */
export async function getAllPosts() {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.id,
                p.user_id,
                p.content,
                p.image_url,
                p.created_at,
                p.updated_at,
                up.name as author_name,
                up.profile_pic_etag
            FROM posts p
            LEFT JOIN user_profiles up ON p.user_id = up.user_id
            ORDER BY p.created_at DESC
        `);

        return rows;
    } catch (err) {
        err.status = err.status || 500;
        throw err;
    }
}

/**
 * Get posts by a specific user
 * @param {Integer} userId - The user's ID
 * @returns Array of posts by the user
 */
export async function getPostsByUserId(userId) {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.id,
                p.user_id,
                p.content,
                p.image_url,
                p.created_at,
                p.updated_at,
                up.name as author_name,
                up.profile_pic_etag
            FROM posts p
            LEFT JOIN user_profiles up ON p.user_id = up.user_id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `, [userId]);

        return rows;
    } catch (err) {
        err.status = err.status || 500;
        throw err;
    }
}

/**
 * Get a single post by ID
 * @param {Integer} postId - The post ID
 * @returns The post object or null
 */
export async function getPostById(postId) {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.id,
                p.user_id,
                p.content,
                p.image_url,
                p.created_at,
                p.updated_at,
                up.name as author_name,
                up.profile_pic_etag
            FROM posts p
            LEFT JOIN user_profiles up ON p.user_id = up.user_id
            WHERE p.id = ?
            LIMIT 1
        `, [postId]);

        return rows[0] || null;
    } catch (err) {
        err.status = err.status || 500;
        throw err;
    }
}

/**
 * Delete a post by ID
 * @param {Integer} postId - The post ID
 * @param {Integer} userId - The user ID (for authorization)
 * @returns Number of affected rows
 */
export async function deletePost(postId, userId) {
    try {
        const [result] = await db.query(`
            DELETE FROM posts
            WHERE id = ? AND user_id = ?
        `, [postId, userId]);

        return result.affectedRows;
    } catch (err) {
        err.status = err.status || 500;
        throw err;
    }
}

export default db;








