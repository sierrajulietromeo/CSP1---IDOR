# 👨‍🏫 Tutor Guide: IDOR Demonstration Application

## HealthTrack Medical Portal - Teaching Resource

---

## 📋 Overview

This application is designed to teach students about **Insecure Direct Object Reference (IDOR)** vulnerabilities through hands-on penetration testing. The HealthTrack Medical Portal simulates a patient records system with intentional security flaws that students can discover and exploit in a safe, controlled environment.

### Learning Outcomes

Students who complete this exercise will:
- Understand the concept of IDOR vulnerabilities
- Differentiate between authentication and authorisation
- Practice using browser developer tools for security testing
- Learn to identify and exploit common web application vulnerabilities
- Understand the importance of server-side authorisation controls


---

## 🔓 Intentional Vulnerabilities

### Vulnerability Summary

The application contains **5 intentional IDOR vulnerabilities**:

| Endpoint | Vulnerability | Exploitation Method |
|----------|--------------|---------------------|
| `/api/patient/:id` | View any patient's profile | Change patient ID in URL |
| `/api/records/:patientId` | View any patient's medical records | Change patient ID parameter |
| `/api/tests/:patientId` | View any patient's test results | Change patient ID parameter |
| `/api/appointments/:patientId` | View any patient's appointments | Change patient ID parameter |
| `/api/record/:recordId` | View any individual medical record | Enumerate record IDs |

### Technical Details

#### The Flaw

Each endpoint accepts a user-supplied ID parameter but **fails to verify** that the authenticated user owns that resource. For example:

```javascript
// VULNERABLE CODE (from server.js)
app.get('/api/patient/:id', requireAuth, (req, res) => {
    const patientId = req.params.id;
    // MISSING: if (req.userId !== patientId) { return 403; }
    const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(patientId);
    res.json(patient);
});
```

#### How It Should Be Fixed

```javascript
// SECURE VERSION (not implemented in demo)
app.get('/api/patient/:id', requireAuth, (req, res) => {
    const patientId = req.params.id;
    
    // Authorisation check
    if (req.userId != patientId) {
        return res.status(403).json({ error: 'Forbidden: Access denied' });
    }
    
    const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(patientId);
    res.json(patient);
});
```

### Authentication vs Authorisation

**Key Teaching Point:** The application implements basic authentication (login required) but lacks proper authorisation (checking resource ownership).

- ✅ **Authentication:** "Who are you?" - Implemented via login and session cookies
- ❌ **Authorisation:** "Are you allowed to access this?" - NOT implemented



### Discussion Prompts

1. **"Why do you think this vulnerability exists?"**
   - Time pressure, lack of security awareness, copy-paste code, assumptions

2. **"How common is IDOR in real applications?"**
   - Very common! OWASP Top 10, numerous bug bounty reports

3. **"How would you fix this vulnerability?"**
   - Server-side authorisation checks, access control frameworks

4. **"What if the IDs were UUIDs instead of sequential numbers?"**
   - Security through obscurity isn't security! Still vulnerable if IDs are leaked

5. **"How would you implement multi-user access (e.g., for doctors)?"**
   - Role-based access control (RBAC), permissions tables, JWT scopes

### Real-World Examples

Share these to emphasise the importance:

- **IDOR in Facebook (2013):** Allowed viewing of private messages
- **IDOR in Uber (2016):** Exposed trip history of any user
- **IDOR in healthcare apps:** Numerous incidents of patient data exposure
- **Government websites:** UK DVLA, US Social Security Administration incidents

---

## 🎯 Learning Extension Activities

### Advanced Tasks

For students who complete the basic exercise:

1. **Automated Exploitation**
   - Write a Python script to enumerate all patients automatically
   - Use the `requests` library to make API calls

2. **Try Other Tools**
   - Use Burp Suite Community Edition to intercept and modify requests
   - Practice using curl with different HTTP methods

3. **Remediation Challenge**
   - Provide students with the source code
   - Ask them to implement proper authorisation checks
   - Test each other's implementations

4. **Bypass Attempts**
   - Discuss other access control bypasses (path traversal, parameter pollution)
   - Can students find creative ways to exploit the system?

---

