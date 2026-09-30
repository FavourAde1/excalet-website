const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

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
// ========== GET ROUTES ==========
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home | Excalet Integrated Services',
    description: 'Professional cleaning, pest control, fumigation and facility management services in Owerri, Imo State. One team, all-in-one services.'
  });
});

app.get('/services', (req, res) => {
  res.render('services', {
    title: 'Our Services | Excalet Integrated Services',
    description: 'Explore our full range of cleaning, pest control, facility management and environmental sanitation services.'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us | Excalet Integrated Services',
    description: 'Learn about Excalet Global Ventures Ltd — professional cleaning, pest control and facility management company based in Owerri.'
  });
});

app.get('/gallery', (req, res) => {
  res.render('gallery', {
    title: 'Gallery | Excalet Integrated Services',
    description: 'Before and after photos of our cleaning and pest control projects in Owerri and beyond.'
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact / Request Quote | Excalet Integrated Services',
    description: 'Request a free inspection or quote for cleaning, pest control or facility management services in Owerri.'
  });
});

app.get('/faq', (req, res) => {
  res.render('faq', {
    title: 'FAQ | Excalet Integrated Services',
    description: 'Frequently asked questions about our cleaning, pest control and facility management services.'
  });
});

app.get('/industries', (req, res) => {
  res.render('industries', {
    title: 'Industries We Serve | Excalet Integrated Services',
    description: 'We serve residential, corporate, schools, hotels, warehouses, construction and government clients.'
  });
});

// ========== SERVICE PAGES ==========
app.get('/services/residential', (req, res) => {
  res.render('services/residential', {
    title: 'Residential Cleaning & Pest Control | Excalet',
    description: 'Professional home cleaning, post-construction cleaning and pest control services in Owerri.'
  });
});

app.get('/services/commercial', (req, res) => {
  res.render('services/commercial', {
    title: 'Commercial Cleaning & Pest Management | Excalet',
    description: 'Office, hotel, school and warehouse cleaning plus integrated pest management services.'
  });
});

app.get('/services/facility-management', (req, res) => {
  res.render('services/facility-management', {
    title: 'Facility Management | Excalet',
    description: 'Hard facility management including HVAC, electrical, plumbing and building maintenance services.'
  });
});

app.get('/services/environmental', (req, res) => {
  res.render('services/environmental', {
    title: 'Environmental & Sanitation | Excalet',
    description: 'Disinfection, waste management, drainage cleaning and grounds maintenance services.'
  });
});
// ========== POST ROUTE ==========
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