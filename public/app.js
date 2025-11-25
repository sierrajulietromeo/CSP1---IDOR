/**
 * HealthTrack Medical Portal - Client Application
 * 
 * EDUCATIONAL PURPOSE - Contains intentional IDOR vulnerabilities
 * Students can exploit these by manipulating API calls in browser DevTools
 */

// Current user state
let currentUser = null;

// Page management
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Display error message
function showError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

function hideError() {
    const errorDiv = document.getElementById('loginError');
    errorDiv.classList.remove('show');
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data;
            loadDashboard();
            showPage('dashboardPage');
        } else {
            showError(data.error || 'Login failed');
        }
    } catch (error) {
        showError('Network error. Please try again.');
        console.error('Login error:', error);
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await fetch('/api/logout', { method: 'POST' });
        currentUser = null;
        showPage('loginPage');
        document.getElementById('loginForm').reset();
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// ============================================================================
// DASHBOARD DATA LOADING
// ============================================================================

/**
 * Load all dashboard data
 * NOTE: The API calls use the current user's ID in the URL
 * This is where the IDOR vulnerability can be exploited!
 */
async function loadDashboard() {
    document.getElementById('currentUserName').textContent =
        `${currentUser.firstName} ${currentUser.lastName}`;

    // Load all data sections
    await loadPatientInfo();
    await loadMedicalRecords();
    await loadTestResults();
    await loadAppointments();
}

/**
 * Load patient information
 * VULNERABLE: The patient ID is in the URL and can be manipulated
 */
async function loadPatientInfo() {
    try {
        // IDOR VULNERABILITY: Change currentUser.id to view other patients
        const response = await fetch(`/api/patient/${currentUser.id}`);
        const patient = await response.json();

        if (response.ok) {
            document.getElementById('patientName').textContent =
                `${patient.first_name} ${patient.last_name}`;
            document.getElementById('nhsNumber').textContent = patient.nhs_number;
            document.getElementById('dob').textContent = patient.date_of_birth;
            document.getElementById('email').textContent = patient.email;
            document.getElementById('phone').textContent = patient.phone;
            document.getElementById('address').textContent = patient.address;
        }
    } catch (error) {
        console.error('Error loading patient info:', error);
    }
}

/**
 * Load medical records
 * VULNERABLE: The patient ID is in the URL and can be manipulated
 */
async function loadMedicalRecords() {
    const container = document.getElementById('medicalRecords');

    try {
        // IDOR VULNERABILITY: Change currentUser.id to view other patients' records
        const response = await fetch(`/api/records/${currentUser.id}`);
        const records = await response.json();

        if (response.ok && records.length > 0) {
            container.innerHTML = records.map(record => `
                <div class="data-item">
                    <div class="item-header">${record.diagnosis}</div>
                    <div class="item-date">📅 ${record.record_date} | 👨‍⚕️ ${record.doctor_name}</div>
                    <div class="item-details">
                        <strong>Treatment:</strong> ${record.treatment || 'N/A'}
                    </div>
                    ${record.notes ? `<div class="item-notes">${record.notes}</div>` : ''}
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="empty">No medical records found</p>';
        }
    } catch (error) {
        console.error('Error loading medical records:', error);
        container.innerHTML = '<p class="error">Error loading medical records</p>';
    }
}

/**
 * Load test results
 * VULNERABLE: The patient ID is in the URL and can be manipulated
 */
async function loadTestResults() {
    const container = document.getElementById('testResults');

    try {
        // IDOR VULNERABILITY: Change currentUser.id to view other patients' test results
        const response = await fetch(`/api/tests/${currentUser.id}`);
        const tests = await response.json();

        if (response.ok && tests.length > 0) {
            container.innerHTML = tests.map(test => `
                <div class="data-item">
                    <div class="item-header">${test.test_type}</div>
                    <div class="item-date">📅 ${test.test_date} | 👨‍⚕️ ${test.ordered_by}</div>
                    <div class="item-details">
                        <strong>Result:</strong> ${test.result}
                    </div>
                    ${test.notes ? `<div class="item-notes">${test.notes}</div>` : ''}
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="empty">No test results found</p>';
        }
    } catch (error) {
        console.error('Error loading test results:', error);
        container.innerHTML = '<p class="error">Error loading test results</p>';
    }
}

/**
 * Load appointments
 * VULNERABLE: The patient ID is in the URL and can be manipulated
 */
async function loadAppointments() {
    const container = document.getElementById('appointments');

    try {
        // IDOR VULNERABILITY: Change currentUser.id to view other patients' appointments
        const response = await fetch(`/api/appointments/${currentUser.id}`);
        const appointments = await response.json();

        if (response.ok && appointments.length > 0) {
            container.innerHTML = appointments.map(apt => `
                <div class="data-item">
                    <div class="item-header">${apt.doctor_name} - ${apt.department}</div>
                    <div class="item-date">📅 ${apt.appointment_date} at ${apt.appointment_time}</div>
                    <div class="item-details">
                        <strong>Reason:</strong> ${apt.reason || 'General consultation'}
                    </div>
                    <div class="item-notes">Status: ${apt.status}</div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="empty">No upcoming appointments</p>';
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        container.innerHTML = '<p class="error">Error loading appointments</p>';
    }
}

// ============================================================================
// INITIALISATION
// ============================================================================

// Check if user is already logged in on page load
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
            // User is still authenticated
            const data = await response.json();
            // We'd need to fetch user details here, but for simplicity, just show login
            showPage('loginPage');
        } else {
            showPage('loginPage');
        }
    } catch (error) {
        showPage('loginPage');
    }
});
