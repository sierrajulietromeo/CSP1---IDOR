# 👨‍🏫 Tutor Guide: IDOR Demonstration Application

## HealthTrack Medical Portal - Teaching Resource

---

## 📋 Overview

This application is designed to teach undergraduate students about **Insecure Direct Object Reference (IDOR)** vulnerabilities through hands-on penetration testing. The HealthTrack Medical Portal simulates a patient records system with intentional security flaws that students can discover and exploit in a safe, controlled environment.

### Learning Outcomes

Students who complete this exercise will:
- Understand the concept of IDOR vulnerabilities
- Differentiate between authentication and authorisation
- Practice using browser developer tools for security testing
- Learn to identify and exploit common web application vulnerabilities
- Understand the importance of server-side authorisation controls
- Develop professional vulnerability reporting skills

---

## ⚙️ Technical Architecture

### Technology Stack

- **Backend:** Node.js with Express.js
- **Database:** SQLite3 (file-based, no external dependencies)
- **Frontend:** Vanilla HTML, CSS, and JavaScript
- **Authentication:** Simple cookie-based sessions (intentionally basic)

### Why These Choices?

- **Simplicity:** No complex frameworks or dependencies to manage
- **Portability:** Runs on any system with Node.js installed
- **Isolation:** Self-contained, no external database server required
- **Network-friendly:** Can be accessed from any device on the local network

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- A private, isolated network (e.g., classroom LAN)

### Initial Setup

1. **Navigate to the application directory:**
   ```bash
   cd /path/to/IDOR
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialise the database with sample data:**
   ```bash
   npm run init
   ```

   This creates the SQLite database and populates it with 5 fictional patients.

4. **Start the server:**
   ```bash
   npm start
   ```

   The server will start on port 3000 and be accessible at:
   - `http://localhost:3000` (from the same machine)
   - `http://<server-ip>:3000` (from other devices on the network)

### Finding Your Server IP

**Linux/macOS:**
```bash
ip addr show
# or
ifconfig
```

**Windows:**
```bash
ipconfig
```

Look for your local network IP (typically `192.168.x.x` or `10.x.x.x`).

---

## 🚀 Running in GitHub Codespaces

GitHub Codespaces provides a convenient way to run this application in a cloud-based development environment.

### Setup in Codespaces

1. **Open the repository in Codespaces:**
   - Create a new Codespace from the repository
   - Wait for the environment to initialise

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialise the database:**
   ```bash
   npm run init
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

### Port Forwarding

When you start the server:
- GitHub Codespaces automatically detects port 3000
- A notification appears with an **Open in Browser** button
- Alternatively, access the **Ports** tab and click the globe icon next to port 3000

### Sharing with Students

**For classroom use in Codespaces:**

1. Go to the **Ports** tab in VS Code
2. Find port 3000 in the list
3. Right-click and select **Port Visibility** → **Public**
4. Copy the forwarded URL (format: `https://username-repo-xxxxx.preview.app.github.dev`)
5. Share this URL with all students

**Advantages:**
- No local network setup required
- All students access the same instance via URL
- No firewall configuration needed
- Works from anywhere with internet access

**Considerations:**
- Ensure port visibility is set to **Public**
- URL remains active while Codespace is running
- Students don't need GitHub accounts to access the public URL
- Database persists in the Codespace workspace

### Codespaces-Specific Notes

- The application binds to `0.0.0.0:3000`, which works with Codespaces port forwarding
- Free tier includes 60 hours/month of Codespaces usage
- Pro accounts get 90 hours/month
- Codespace auto-suspends after 30 minutes of inactivity
- Use `npm run reset` to restore the database if needed

---


## 👥 Student Access

### Network Configuration

The server is configured to listen on `0.0.0.0`, making it accessible from any device on the same network. Ensure all student machines are connected to the same private network as the server.

### Student Instructions

Provide students with:
1. The server IP address and port (e.g., `http://192.168.1.100:3000`)
2. The `STUDENT_GUIDE.md` document
3. Demo credentials (any of the 5 patient accounts)

### Demo Credentials

All passwords are `password123` for simplicity:

| Username | Patient Name | Patient ID |
|----------|--------------|------------|
| `jsmith` | John Smith | 1 |
| `ejones` | Emma Jones | 2 |
| `mbrown` | Michael Brown | 3 |
| `swilson` | Sarah Wilson | 4 |
| `dtaylor` | David Taylor | 5 |

**Recommendation:** Have students log in as different patients to verify they can only see their "own" data initially, before attempting exploitation.

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

---

## 🎓 Teaching Recommendations

### Session Structure (90-minute lab)

#### Introduction (15 minutes)
- Explain IDOR concept and real-world examples
- Discuss the importance of access control
- Introduce the HealthTrack scenario
- Distribute student guide

#### Guided Exploration (30 minutes)
- Walk through logging in and using the application normally
- Demonstrate how to use browser DevTools (Network tab)
- Show how to inspect API requests
- Guide students through their first IDOR exploit

#### Independent Practice (30 minutes)
- Students complete the enumeration exercise
- Students try different exploitation methods (DevTools, curl)
- Encourage students to work in pairs

#### Discussion & Reporting (15 minutes)
- Review findings as a class
- Discuss real-world impact and examples
- Practice writing vulnerability reports
- Explain proper remediation

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

## 🔄 Resetting the Database

### When to Reset

- At the start of each session
- If the database becomes corrupted
- If students modify data and you need a clean state

### How to Reset

**Method 1: Using npm script (recommended)**
```bash
npm run reset
```

**Method 2: Manual reset**
```bash
node reset.js
```

**Method 3: Complete reinstallation**
```bash
rm healthtrack.db
npm run init
```

### What Gets Reset

- All patient data returns to original state
- All medical records, test results, and appointments restored
- Database structure recreated if needed

**Note:** You don't need to restart the server after resetting. The next API call will read from the fresh database.

---

## 🐛 Troubleshooting

### Server won't start

**Error:** `Cannot find module 'express'`
- **Solution:** Run `npm install`

**Error:** `EADDRINUSE: address already in use`
- **Solution:** Port 3000 is in use. Either:
  - Find and kill the process: `lsof -i :3000` then `kill <PID>`
  - Change the port: `PORT=3001 npm start`

### Can't connect from other machines

- **Check firewall:** Ensure port 3000 is open
  ```bash
  # Linux
  sudo ufw allow 3000
  
  # Windows - add firewall rule in Windows Defender
  ```
- **Verify network:** Ensure all machines are on the same subnet
- **Test connectivity:** `ping <server-ip>` from student machines

### Database errors

**Error:** `SQLITE_CORRUPT: database disk image is malformed`
- **Solution:** Reset the database: `npm run reset`

### Students can't exploit vulnerabilities

- **Check cookies:** Ensure students are logged in (userId cookie set)
- **Check network tab:** Verify API requests are being made
- **Check server logs:** Look for error messages in the terminal
- **Verify IDs:** Ensure students are using valid patient IDs (1-5)

---

## 📊 Assessment Ideas

### Practical Assessment
- **Task:** Provide students with a similar vulnerable application and ask them to identify and document all IDOR vulnerabilities
- **Deliverable:** Professional vulnerability report with PoC

### Written Assessment
- Explain the difference between authentication and authorisation
- Describe how to remediate an IDOR vulnerability
- Discuss real-world impact of IDOR in healthcare systems

### Group Project
- Have students build a "secure" version of the portal
- Peer review and attempt to find vulnerabilities in each other's code

---

## 🔒 Security Considerations

### Important Warnings

> [!CAUTION]
> **NEVER deploy this application on a public network or the internet!**

- This application is intentionally vulnerable
- It contains no proper security controls
- It uses weak passwords and insecure session management
- It should ONLY be used on isolated, private networks

### Network Isolation

**Recommended setup:**
- Use a dedicated VLAN or isolated network segment
- Do NOT connect the training network to the internet
- Use a separate router/switch if possible
- Disable Wi-Fi if using wired networking

### Data Protection

- All patient data is **fictional**
- Do not use real names, addresses, or medical information
- Ensure students understand this is simulated data

---

## 📁 File Structure

```
IDOR/
├── server.js              # Express server with vulnerable endpoints
├── database.js            # SQLite database module
├── init-db.js            # Database initialisation script
├── reset.js              # Database reset script
├── package.json          # Node.js dependencies
├── healthtrack.db        # SQLite database file (generated)
├── public/
│   ├── index.html        # Frontend HTML
│   ├── styles.css        # CSS styling
│   └── app.js            # Client-side JavaScript
├── STUDENT_GUIDE.md      # Student instructions
├── TUTOR_GUIDE.md        # This file
└── README.md             # Quick start guide
```

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

## 📚 Additional Resources

### For Students
- OWASP Top 10: A01:2021 - Broken Access Control
- PortSwigger Web Security Academy (free labs)
- OWASP WebGoat (practice application)

### For Educators
- OWASP Vulnerable Web Applications Directory
- OWASP Cheat Sheet Series: Access Control
- Information Commissioner's Office (ICO) guidance on GDPR

---

## 📝 Sample Marking Rubric

| Criterion | Excellent (90-100%) | Good (70-89%) | Satisfactory (50-69%) | Poor (<50%) |
|-----------|---------------------|---------------|------------------------|-------------|
| **Exploitation** | Finds all 5 vulnerabilities | Finds 3-4 vulnerabilities | Finds 1-2 vulnerabilities | Cannot exploit |
| **Methodology** | Systematic, documented approach | Logical process | Trial and error | Random attempts |
| **Reporting** | Professional, detailed report | Clear report with PoC | Basic findings listed | Incomplete |
| **Understanding** | Explains root cause and fix | Describes the vulnerability | Identifies the issue | Limited understanding |

---

## 💡 Tips for Success

1. **Preparation:** Run through the exercise yourself before the session
2. **Environment:** Test network connectivity beforehand
3. **Support:** Have a TA or assistant available for technical issues
4. **Pacing:** Don't rush - let students explore and discover
5. **Discussion:** The debrief is as important as the exploitation
6. **Ethics:** Emphasise legal and ethical considerations throughout

---

## 🔄 Version History

- **v1.0** - Initial release with 5 IDOR vulnerabilities

---

## 📧 Support

For issues with this teaching resource:
- Review the troubleshooting section
- Check server logs in the terminal
- Verify network configuration
- Reset the database and try again

---

**Good luck with your teaching! This hands-on approach will give students valuable practical experience with web application security.** 🎓🔐
