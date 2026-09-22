const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// ========== GET ROUTES ==========
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home | Excalet Integrated Services'
  });
});

app.get('/services', (req, res) => {
  res.render('services', {
    title: 'Services | Excalet Integrated Services'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us | Excalet Integrated Services'
  });
});

app.get('/gallery', (req, res) => {
  res.render('gallery', {
    title: 'Gallery | Excalet Integrated Services'
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact / Request Quote | Excalet Integrated Services'
  });
});

// ========== POST ROUTE (IMPORTANT) ==========
app.post('/contact', (req, res) => {
  const { name, phone, email, service, message } = req.body;

  console.log('===== NEW QUOTE REQUEST =====');
  console.log('Name:', name);
  console.log('Phone:', phone);
  console.log('Email:', email);
  console.log('Service:', service);
  console.log('Message:', message);
  console.log('==============================');

  res.send(`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 80px auto; text-align: center;">
      <h1 style="color: #16a34a;">Thank You!</h1>
      <p>Your quote request has been received.</p>
      <p>We will contact you shortly on <strong>${phone}</strong>.</p>
      <br>
      <a href="/" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
        Back to Home
      </a>
    </div>
  `);
});

// Start server only when running locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export the app for Vercel
module.exports = app;