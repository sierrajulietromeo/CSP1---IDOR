# 🏥 HealthTrack Medical Portal - IDOR Demonstration

[![Educational Use Only](https://img.shields.io/badge/USE-Educational%20Only-red)](https://github.com)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)](https://nodejs.org)
[![SQLite](https://img.shields.io/badge/SQLite-3-blue)](https://www.sqlite.org)

An educational web application designed to demonstrate **Insecure Direct Object Reference (IDOR)** vulnerabilities for undergraduate cybersecurity students.

---

## ⚠️ Important Warning

> [!CAUTION]
> This application contains **intentional security vulnerabilities** for educational purposes.
> 
> - **DO NOT** deploy on public networks or the internet
> - **DO NOT** use with real data
> - **ONLY** use on isolated, private networks for training
> - Unauthorised access to computer systems is illegal under the Computer Misuse Act 1990

---

## 📋 Overview

**HealthTrack Medical Portal** is a simulated patient records system that allows students to learn about IDOR vulnerabilities through hands-on penetration testing. Students will discover how to exploit common access control flaws in web applications.

### What is IDOR?

**Insecure Direct Object Reference (IDOR)** occurs when an application exposes direct references to internal objects (like database IDs) without properly verifying that the user is authorised to access them.

---

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /path/to/IDOR
   ```

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

5. **Access the application:**
   - Local access: `http://localhost:3000`
   - Network access: `http://<your-ip>:3000`

### Demo Credentials

All accounts use password: `password123`

- Username: `jsmith` (John Smith)
- Username: `ejones` (Emma Jones)
- Username: `mbrown` (Michael Brown)
- Username: `swilson` (Sarah Wilson)
- Username: `dtaylor` (David Taylor)

---

## 🚀 Running in GitHub Codespaces

If you're using GitHub Codespaces, follow these instructions:

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialise the database:**
   ```bash
   npm run init
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

### Accessing the Application

When you start the server in Codespaces:
- Port 3000 will be automatically forwarded
- A notification will appear with a button to open the application
- Alternatively, go to the **Ports** tab in Codespaces and click the globe icon next to port 3000

### Port Visibility

By default, forwarded ports may be private. To share with students:

1. Click the **Ports** tab
2. Right-click on port 3000
3. Select **Port Visibility** → **Public**
4. Copy the forwarded URL (format: `https://username-repo-xxxxx.preview.app.github.dev`)
5. Share this URL with students

> [!NOTE]
> In Codespaces, the application URL will be different from `localhost:3000`. Use the forwarded URL provided by GitHub instead.

### Codespaces-Specific Notes

- The server binds to `0.0.0.0:3000`, which works correctly with Codespaces port forwarding
- All students can access the same Codespace URL simultaneously
- Database persists in your Codespace workspace
- Use `npm run reset` to restore the database if needed



## 📚 Documentation

- **[STUDENT_GUIDE.md](STUDENT_GUIDE.md)** - Comprehensive penetration testing guide with step-by-step instructions
- **[TUTOR_GUIDE.md](TUTOR_GUIDE.md)** - Teaching resource with setup, assessment ideas, and troubleshooting

---

## 🔄 Resetting the Database

If you need to restore the database to its original state:

```bash
npm run reset
```

This will delete the existing database and recreate it with all sample data.

---

## 🛠️ Technical Stack

- **Backend:** Node.js with Express.js
- **Database:** SQLite3 (file-based)
- **Frontend:** HTML, CSS, JavaScript
- **Authentication:** Simple cookie-based sessions

---

## 🎯 Learning Objectives

Students will learn to:

1. Identify IDOR vulnerabilities in web applications
2. Exploit IDOR using browser DevTools and other tools
3. Understand the difference between authentication and authorisation
4. Use proper penetration testing methodology
5. Write professional vulnerability reports

---

## 🔓 Vulnerabilities Included

This application contains the following intentional IDOR vulnerabilities:

1. **Patient Profile Access** - View any patient's personal information
2. **Medical Records Access** - View any patient's medical history
3. **Test Results Access** - View any patient's lab results
4. **Appointment Access** - View any patient's appointments
5. **Individual Record Access** - Direct access to specific medical records

---

## 📁 Project Structure

```
IDOR/
├── server.js              # Express server with vulnerable endpoints
├── database.js            # SQLite database module
├── init-db.js            # Database initialisation script
├── reset.js              # Database reset script
├── package.json          # Dependencies
├── public/
│   ├── index.html        # Frontend interface
│   ├── styles.css        # Styling
│   └── app.js            # Client-side logic
├── STUDENT_GUIDE.md      # Student instructions
├── TUTOR_GUIDE.md        # Educator guide
└── README.md             # This file
```

---

## 🌐 Network Configuration

### For Classroom Use

The server listens on `0.0.0.0:3000`, making it accessible from any device on the same network.

**Find your server IP:**

Linux/macOS:
```bash
ip addr show
# or
ifconfig
```

Windows:
```bash
ipconfig
```

**Provide students with:**
```
http://<your-ip>:3000
```

### Firewall Configuration

If students can't connect, you may need to allow port 3000:

```bash
# Linux (UFW)
sudo ufw allow 3000

# Linux (firewalld)
sudo firewall-cmd --add-port=3000/tcp

# Windows - Add inbound rule in Windows Defender Firewall
```

---

## 🐛 Troubleshooting

### Server won't start

**Problem:** `Cannot find module 'express'`

**Solution:**
```bash
npm install
```

**Problem:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

### Database issues

**Problem:** Database corruption or errors

**Solution:**
```bash
npm run reset
```

### Network connectivity

- Ensure all devices are on the same network
- Check firewall settings
- Verify the server IP address
- Test with `ping <server-ip>`

---

## 🔒 Security Notice

### Network Isolation

This application should **ONLY** be run on:
- Private, isolated classroom networks
- Local development environments
- Dedicated training VLANs

### What NOT to do

- ❌ Deploy to the internet
- ❌ Use on a corporate network
- ❌ Store or process real patient data
- ❌ Use in production environments

### What to do

- ✅ Use on isolated classroom networks
- ✅ Ensure all data is fictional
- ✅ Emphasise legal and ethical guidelines to students
- ✅ Supervise student testing activities

---

## 📜 Legal & Ethical Notice

**For Students:**

This application is provided for **authorised educational use only**. Penetration testing on systems without explicit permission is illegal under:

- Computer Misuse Act 1990 (UK)
- Computer Fraud and Abuse Act (US)
- Similar legislation in other jurisdictions

**Always:**
- Obtain written authorisation before testing
- Stay within the scope of your authorisation
- Report vulnerabilities responsibly
- Follow ethical hacking guidelines

---

## 🎓 Educational Context

This application is designed for:

- **Undergraduate cybersecurity courses**
- **Penetration testing modules**
- **Web application security training**
- **OWASP Top 10 education**

Recommended for students who have basic knowledge of:
- HTTP and web applications
- HTML/JavaScript
- Browser DevTools

---

## 📖 Further Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [OWASP Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)

---

## 📝 Sample Data

The database includes:
- **5 fictional patients** with complete profiles
- **7 medical records** with various conditions
- **6 test results** (blood tests, imaging, etc.)
- **5 upcoming appointments**

All data is entirely fictional and generated for educational purposes.

---

## 🤝 Support

For issues or questions:

1. Check the [TUTOR_GUIDE.md](TUTOR_GUIDE.md) troubleshooting section
2. Review server logs in the terminal
3. Verify database integrity with `npm run reset`

---

## 📄 Licence

This educational resource is provided as-is for teaching purposes.

---

**Built for educational excellence in cybersecurity training.** 🔐📚
