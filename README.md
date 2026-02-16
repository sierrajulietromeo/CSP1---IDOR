# 🏥 HealthTrack Medical Portal - IDOR Demonstration

[![Educational Use Only](https://img.shields.io/badge/USE-Educational%20Only-red)](https://github.com)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)](https://nodejs.org)
[![SQLite](https://img.shields.io/badge/SQLite-3-blue)](https://www.sqlite.org)

An educational web application designed to demonstrate **Insecure Direct Object Reference (IDOR)** vulnerabilities for cybersecurity students.

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

**HealthTrack Medical Portal** is a simulated patient records system that allows you to learn about IDOR vulnerabilities through hands-on penetration testing. You will discover how to exploit common access control flaws in web applications.

### What is IDOR?

**Insecure Direct Object Reference (IDOR)** occurs when an application exposes direct references to internal objects (like database IDs) without properly verifying that the user is authorised to access them.

---

## 🚀 Running in GitHub Codespaces

### Setup Steps

1. **Open the application in GitHub Codespaces:**

2. **Codespaces will try to automatically install dependencies: **
   If for some reason it fails (you get a ❌) then:
   ```bash
   nvm install 16
   npm install
   ```
(This may take a few minutes to run, but then all will be well)

   

3. **Codespaces will automatically initialise the database. If for some reason it doesn't, you can run:**
   ```bash
   npm run init
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

### Demo Credentials

All accounts use password: `password123`

- Username: `jsmith` (John Smith)
- Username: `ejones` (Emma Jones)
- Username: `mbrown` (Michael Brown)
- Username: `swilson` (Sarah Wilson)
- Username: `dtaylor` (David Taylor)

---


### Accessing the Application

When you start the server in Codespaces:
- Port 3000 will be automatically forwarded
- A notification will appear with a button to open the application
- Alternatively, go to the **Ports** tab in Codespaces and click the globe icon next to port 3000

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


## 📖 Further Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [OWASP Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)

