/**
 * HealthTrack Medical Portal - Server
 * 
 * EDUCATIONAL PURPOSE ONLY - Contains intentional IDOR vulnerabilities
 * DO NOT use this code in production or with real data
 * 
 * This application demonstrates Insecure Direct Object Reference (IDOR) vulnerabilities
 * for undergraduate cybersecurity students to learn penetration testing.
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { getDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

/**
 * Simple authentication middleware
 * Intentionally basic for educational purposes
 */
function requireAuth(req, res, next) {
    const userId = req.cookies.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    req.userId = userId;
    next();
}

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * Login endpoint
 * Returns patient information and sets session cookie
 */
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    const db = getDatabase();

    try {
        const patient = db.prepare('SELECT * FROM patients WHERE username = ? AND password = ?')
            .get(username, password);

        if (!patient) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Set simple cookie-based session (intentionally insecure for demo)
        res.cookie('userId', patient.id, { httpOnly: false }); // httpOnly: false allows JS access

        // Return basic patient info
        res.json({
            id: patient.id,
            username: patient.username,
            firstName: patient.first_name,
            lastName: patient.last_name
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        db.close();
    }
});

/**
 * Logout endpoint
 */
app.post('/api/logout', (req, res) => {
    res.clearCookie('userId');
    res.json({ message: 'Logged out successfully' });
});

/**
 * Check authentication status
 */
app.get('/api/auth/check', requireAuth, (req, res) => {
    res.json({ authenticated: true, userId: req.userId });
});

// ============================================================================
// VULNERABLE ENDPOINTS - IDOR DEMONSTRATIONS
// ============================================================================

/**
 * VULNERABILITY #1: Get patient profile by ID
 * 
 * FLAW: No check that the logged-in user owns this profile
 * EXPLOIT: Change the ID parameter to view other patients' profiles
 */
app.get('/api/patient/:id', requireAuth, (req, res) => {
    const patientId = req.params.id;
    const db = getDatabase();

    try {
        // VULNERABLE: No authorisation check!
        // Should verify: req.userId === patientId
        const patient = db.prepare(`
            SELECT id, first_name, last_name, date_of_birth, nhs_number, 
                   email, phone, address 
            FROM patients 
            WHERE id = ?
        `).get(patientId);

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        res.json(patient);

    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        db.close();
    }
});

/**
 * VULNERABILITY #2: Get medical records by patient ID
 * 
 * FLAW: No check that the logged-in user owns these records
 * EXPLOIT: Change the patientId parameter to view other patients' medical records
 */
app.get('/api/records/:patientId', requireAuth, (req, res) => {
    const patientId = req.params.patientId;
    const db = getDatabase();

    try {
        // VULNERABLE: No authorisation check!
        // Should verify: req.userId === patientId
        const records = db.prepare(`
            SELECT * FROM medical_records 
            WHERE patient_id = ?
            ORDER BY record_date DESC
        `).all(patientId);

        res.json(records);

    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        db.close();
    }
});

/**
 * VULNERABILITY #3: Get test results by patient ID
 * 
 * FLAW: No check that the logged-in user owns these test results
 * EXPLOIT: Change the patientId parameter to view other patients' test results
 */
app.get('/api/tests/:patientId', requireAuth, (req, res) => {
    const patientId = req.params.patientId;
    const db = getDatabase();

    try {
        // VULNERABLE: No authorisation check!
        // Should verify: req.userId === patientId
        const tests = db.prepare(`
            SELECT * FROM test_results 
            WHERE patient_id = ?
            ORDER BY test_date DESC
        `).all(patientId);

        res.json(tests);

    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        db.close();
    }
});

/**
 * VULNERABILITY #4: Get appointments by patient ID
 * 
 * FLAW: No check that the logged-in user owns these appointments
 * EXPLOIT: Change the patientId parameter to view other patients' appointments
 */
app.get('/api/appointments/:patientId', requireAuth, (req, res) => {
    const patientId = req.params.patientId;
    const db = getDatabase();

    try {
        // VULNERABLE: No authorisation check!
        // Should verify: req.userId === patientId
        const appointments = db.prepare(`
            SELECT * FROM appointments 
            WHERE patient_id = ?
            ORDER BY appointment_date, appointment_time
        `).all(patientId);

        res.json(appointments);

    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        db.close();
    }
});

/**
 * VULNERABILITY #5: Get a single medical record by record ID
 * 
 * FLAW: No check that the record belongs to the logged-in user
 * EXPLOIT: Change the recordId to view any medical record in the system
 */
app.get('/api/record/:recordId', requireAuth, (req, res) => {
    const recordId = req.params.recordId;
    const db = getDatabase();

    try {
        // VULNERABLE: No check that this record belongs to the logged-in user
        const record = db.prepare(`
            SELECT r.*, p.first_name, p.last_name, p.nhs_number
            FROM medical_records r
            JOIN patients p ON r.patient_id = p.id
            WHERE r.id = ?
        `).get(recordId);

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json(record);

    } catch (error) {
        console.error('Error fetching record:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        db.close();
    }
});

// ============================================================================
// SERVER START
// ============================================================================

app.listen(PORT, '0.0.0.0', () => {
    console.log('\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║   HealthTrack Medical Portal - IDOR Demonstration Server    ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');
    console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
    console.log(`✓ Accessible on local network`);
    console.log(`\n⚠️  WARNING: This application contains intentional security`);
    console.log(`   vulnerabilities for educational purposes only!`);
    console.log(`\n   DO NOT deploy to public networks or use with real data.\n`);
});
