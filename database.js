/**
 * Database module for HealthTrack Medical Portal
 * Manages SQLite3 database connection and schema
 * 
 * EDUCATIONAL PURPOSE ONLY - Contains intentional security vulnerabilities
 */

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'healthtrack.db');

/**
 * Initialise the database with schema
 * Creates all required tables for the medical portal
 */
function initialiseDatabase() {
    const db = new Database(DB_PATH);

    // Create patients table
    db.exec(`
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            date_of_birth TEXT NOT NULL,
            nhs_number TEXT UNIQUE NOT NULL,
            email TEXT,
            phone TEXT,
            address TEXT
        )
    `);

    // Create medical_records table
    db.exec(`
        CREATE TABLE IF NOT EXISTS medical_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
            record_date TEXT NOT NULL,
            diagnosis TEXT NOT NULL,
            treatment TEXT,
            notes TEXT,
            doctor_name TEXT,
            FOREIGN KEY (patient_id) REFERENCES patients(id)
        )
    `);

    // Create test_results table
    db.exec(`
        CREATE TABLE IF NOT EXISTS test_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
            test_date TEXT NOT NULL,
            test_type TEXT NOT NULL,
            result TEXT NOT NULL,
            notes TEXT,
            ordered_by TEXT,
            FOREIGN KEY (patient_id) REFERENCES patients(id)
        )
    `);

    // Create appointments table
    db.exec(`
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
            appointment_date TEXT NOT NULL,
            appointment_time TEXT NOT NULL,
            doctor_name TEXT NOT NULL,
            department TEXT NOT NULL,
            reason TEXT,
            status TEXT DEFAULT 'scheduled',
            FOREIGN KEY (patient_id) REFERENCES patients(id)
        )
    `);

    return db;
}

/**
 * Reset the database by deleting and recreating it
 */
function resetDatabase() {
    const fs = require('fs');

    // Delete existing database file
    if (fs.existsSync(DB_PATH)) {
        fs.unlinkSync(DB_PATH);
        console.log('✓ Existing database deleted');
    }

    // Recreate database with schema
    const db = initialiseDatabase();
    console.log('✓ Database schema recreated');

    return db;
}

/**
 * Get database connection
 */
function getDatabase() {
    return new Database(DB_PATH);
}

module.exports = {
    initialiseDatabase,
    resetDatabase,
    getDatabase,
    DB_PATH
};
