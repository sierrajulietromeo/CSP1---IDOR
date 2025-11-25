/**
 * Database Initialisation Script
 * Populates the database with sample data for IDOR demonstration
 * 
 * Run with: npm run init
 */

const { resetDatabase } = require('./database');

console.log('Initialising HealthTrack Medical Portal Database...\n');

const db = resetDatabase();

// Sample patients with simple passwords for educational purposes
const patients = [
    {
        username: 'jsmith',
        password: 'password123',  // Intentionally weak for educational demo
        first_name: 'John',
        last_name: 'Smith',
        date_of_birth: '1985-03-15',
        nhs_number: 'NHS-001-2345',
        email: 'john.smith@email.com',
        phone: '07700 900001',
        address: '123 High Street, London, SW1A 1AA'
    },
    {
        username: 'ejones',
        password: 'password123',
        first_name: 'Emma',
        last_name: 'Jones',
        date_of_birth: '1990-07-22',
        nhs_number: 'NHS-002-3456',
        email: 'emma.jones@email.com',
        phone: '07700 900002',
        address: '45 Park Lane, Manchester, M1 1AA'
    },
    {
        username: 'mbrown',
        password: 'password123',
        first_name: 'Michael',
        last_name: 'Brown',
        date_of_birth: '1978-11-30',
        nhs_number: 'NHS-003-4567',
        email: 'michael.brown@email.com',
        phone: '07700 900003',
        address: '78 Queen Street, Birmingham, B1 1AA'
    },
    {
        username: 'swilson',
        password: 'password123',
        first_name: 'Sarah',
        last_name: 'Wilson',
        date_of_birth: '1995-05-18',
        nhs_number: 'NHS-004-5678',
        email: 'sarah.wilson@email.com',
        phone: '07700 900004',
        address: '12 King Road, Leeds, LS1 1AA'
    },
    {
        username: 'dtaylor',
        password: 'password123',
        first_name: 'David',
        last_name: 'Taylor',
        date_of_birth: '1982-09-08',
        nhs_number: 'NHS-005-6789',
        email: 'david.taylor@email.com',
        phone: '07700 900005',
        address: '56 Castle Avenue, Edinburgh, EH1 1AA'
    }
];

// Insert patients
const insertPatient = db.prepare(`
    INSERT INTO patients (username, password, first_name, last_name, date_of_birth, nhs_number, email, phone, address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

patients.forEach(patient => {
    insertPatient.run(
        patient.username,
        patient.password,
        patient.first_name,
        patient.last_name,
        patient.date_of_birth,
        patient.nhs_number,
        patient.email,
        patient.phone,
        patient.address
    );
});

console.log(`✓ Inserted ${patients.length} patients`);

// Sample medical records
const medicalRecords = [
    { patient_id: 1, record_date: '2024-10-15', diagnosis: 'Type 2 Diabetes', treatment: 'Metformin 500mg daily', notes: 'Blood sugar levels elevated. Advised lifestyle changes.', doctor_name: 'Dr. A. Patel' },
    { patient_id: 1, record_date: '2024-08-22', diagnosis: 'Hypertension', treatment: 'Ramipril 5mg daily', notes: 'Blood pressure 145/95. Monitoring required.', doctor_name: 'Dr. A. Patel' },
    { patient_id: 2, record_date: '2024-11-05', diagnosis: 'Asthma', treatment: 'Salbutamol inhaler as needed', notes: 'Mild persistent asthma. Peak flow normal.', doctor_name: 'Dr. R. Singh' },
    { patient_id: 3, record_date: '2024-09-30', diagnosis: 'Depression', treatment: 'Sertraline 50mg daily', notes: 'Patient responding well to treatment. Follow-up in 6 weeks.', doctor_name: 'Dr. L. Chen' },
    { patient_id: 3, record_date: '2024-07-12', diagnosis: 'Lower Back Pain', treatment: 'Physiotherapy referral', notes: 'Chronic lower back pain. No red flags identified.', doctor_name: 'Dr. M. Ahmed' },
    { patient_id: 4, record_date: '2024-10-28', diagnosis: 'Migraine', treatment: 'Sumatriptan 50mg as needed', notes: 'Frequent migraines. Trigger diary recommended.', doctor_name: 'Dr. S. Murphy' },
    { patient_id: 5, record_date: '2024-11-10', diagnosis: 'High Cholesterol', treatment: 'Atorvastatin 20mg daily', notes: 'Total cholesterol 6.5. Diet and exercise advice given.', doctor_name: 'Dr. J. Williams' }
];

const insertRecord = db.prepare(`
    INSERT INTO medical_records (patient_id, record_date, diagnosis, treatment, notes, doctor_name)
    VALUES (?, ?, ?, ?, ?, ?)
`);

medicalRecords.forEach(record => {
    insertRecord.run(
        record.patient_id,
        record.record_date,
        record.diagnosis,
        record.treatment,
        record.notes,
        record.doctor_name
    );
});

console.log(`✓ Inserted ${medicalRecords.length} medical records`);

// Sample test results
const testResults = [
    { patient_id: 1, test_date: '2024-10-10', test_type: 'HbA1c', result: '58 mmol/mol (Elevated)', notes: 'Indicates diabetes. Retest in 3 months.', ordered_by: 'Dr. A. Patel' },
    { patient_id: 1, test_date: '2024-08-20', test_type: 'Blood Pressure', result: '145/95 mmHg', notes: 'Stage 1 hypertension.', ordered_by: 'Dr. A. Patel' },
    { patient_id: 2, test_date: '2024-11-01', test_type: 'Lung Function', result: 'FEV1: 85% predicted', notes: 'Mild obstruction consistent with asthma.', ordered_by: 'Dr. R. Singh' },
    { patient_id: 3, test_date: '2024-09-15', test_type: 'Blood Test', result: 'All normal', notes: 'Routine bloods before starting antidepressant.', ordered_by: 'Dr. L. Chen' },
    { patient_id: 4, test_date: '2024-10-20', test_type: 'MRI Brain', result: 'No abnormalities detected', notes: 'Scan clear. Migraines likely primary.', ordered_by: 'Dr. S. Murphy' },
    { patient_id: 5, test_date: '2024-11-05', test_type: 'Lipid Profile', result: 'Total Chol: 6.5, LDL: 4.2', notes: 'Elevated cholesterol requiring treatment.', ordered_by: 'Dr. J. Williams' }
];

const insertTest = db.prepare(`
    INSERT INTO test_results (patient_id, test_date, test_type, result, notes, ordered_by)
    VALUES (?, ?, ?, ?, ?, ?)
`);

testResults.forEach(test => {
    insertTest.run(
        test.patient_id,
        test.test_date,
        test.test_type,
        test.result,
        test.notes,
        test.ordered_by
    );
});

console.log(`✓ Inserted ${testResults.length} test results`);

// Sample appointments
const appointments = [
    { patient_id: 1, appointment_date: '2024-12-15', appointment_time: '10:30', doctor_name: 'Dr. A. Patel', department: 'Endocrinology', reason: 'Diabetes review', status: 'scheduled' },
    { patient_id: 2, appointment_date: '2024-12-08', appointment_time: '14:00', doctor_name: 'Dr. R. Singh', department: 'Respiratory', reason: 'Asthma follow-up', status: 'scheduled' },
    { patient_id: 3, appointment_date: '2024-12-20', appointment_time: '11:15', doctor_name: 'Dr. L. Chen', department: 'Mental Health', reason: 'Depression review', status: 'scheduled' },
    { patient_id: 4, appointment_date: '2024-12-10', appointment_time: '09:45', doctor_name: 'Dr. S. Murphy', department: 'Neurology', reason: 'Migraine consultation', status: 'scheduled' },
    { patient_id: 5, appointment_date: '2024-12-18', appointment_time: '15:30', doctor_name: 'Dr. J. Williams', department: 'Cardiology', reason: 'Cholesterol follow-up', status: 'scheduled' }
];

const insertAppointment = db.prepare(`
    INSERT INTO appointments (patient_id, appointment_date, appointment_time, doctor_name, department, reason, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);

appointments.forEach(appointment => {
    insertAppointment.run(
        appointment.patient_id,
        appointment.appointment_date,
        appointment.appointment_time,
        appointment.doctor_name,
        appointment.department,
        appointment.reason,
        appointment.status
    );
});

console.log(`✓ Inserted ${appointments.length} appointments`);

db.close();

console.log('\n✓ Database initialisation complete!');
console.log('\nSample credentials:');
console.log('  Username: jsmith   Password: password123');
console.log('  Username: ejones   Password: password123');
console.log('  Username: mbrown   Password: password123');
console.log('  Username: swilson  Password: password123');
console.log('  Username: dtaylor  Password: password123');
