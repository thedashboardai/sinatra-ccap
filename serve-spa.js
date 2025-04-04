const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// Static directories
app.use(express.static(path.join(__dirname, 'dist')));

// Admin routes
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/admin/index.html'));
});

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/admin/index.html'));
});

// Student routes
app.get('/student', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/student/index.html'));
});

app.get('/student/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/student/index.html'));
});

// Intake form routes
app.get('/intake', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/admin/index.html'));
});

app.get('/intake/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/admin/index.html'));
});

// Default route - landing page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`- Landing page: http://localhost:${port}`);
  console.log(`- Admin dashboard: http://localhost:${port}/admin`);
  console.log(`- Student dashboard: http://localhost:${port}/student`);
  console.log(`- Intake form: http://localhost:${port}/intake`);
});