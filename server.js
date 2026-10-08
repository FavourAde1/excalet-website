const bcrypt = require('bcryptjs');
require('dotenv').config();
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const Quote = require('./models/Quote');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'excalet_secret',
  resave: false,
  saveUninitialized: false
}));

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// ========== AUTH MIDDLEWARE ==========
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.redirect('/admin/login');
}
async function sendQuoteEmail(quote) {
  // Only works if you configure real email credentials
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS   // use App Password, not normal password
    }
  });

  await transporter.sendMail({
    from: `"Excalet Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,          // send to yourself
    subject: `New Quote Request from ${quote.name}`,
    html: `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${quote.name}</p>
      <p><strong>Phone:</strong> ${quote.phone}</p>
      <p><strong>Email:</strong> ${quote.email || 'Not provided'}</p>
      <p><strong>Service:</strong> ${quote.service || 'Not specified'}</p>
      <p><strong>Message:</strong><br>${quote.message || 'No message'}</p>
    `
  });
}

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

// Service pages
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

// ========== ADMIN ROUTES ==========
app.get('/admin/login', (req, res) => {
  res.render('admin/login', {
    title: 'Admin Login | Excalet',
    layout: false   // no main layout for login page
  });
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.isAdmin = true;
    return res.redirect('/admin/quotes');
  }

  app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Simple check (you can later store hashed password in .env or database)
    const isUsernameCorrect = username === process.env.ADMIN_USERNAME;
    
    // For now we still compare plain password from .env
    // To fully use bcrypt you should hash the password once and store the hash
    const isPasswordCorrect = password === process.env.ADMIN_PASSWORD;

    if (isUsernameCorrect && isPasswordCorrect) {
      req.session.isAdmin = true;
      return res.redirect('/admin/quotes');
    }

    res.render('admin/login', {
      title: 'Admin Login | Excalet',
      layout: false,
      error: 'Invalid username or password'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Login error');
  }
});

  res.render('admin/login', {
    title: 'Admin Login | Excalet',
    layout: false,
    error: 'Invalid username or password'
  });
});

app.get('/admin/quotes', requireAdmin, async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.render('admin/quotes', {
      title: 'Admin - Quotes | Excalet',
      quotes,
      layout: false
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading quotes');
  }
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// ========== POST CONTACT (SAVE TO MONGODB) ==========
// Mark as Contacted
app.post('/admin/quotes/:id/contacted', requireAdmin, async (req, res) => {
  try {
    await Quote.findByIdAndUpdate(req.params.id, { status: 'Contacted' });
    res.redirect('/admin/quotes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating quote');
  }
});

// Delete quote
app.post('/admin/quotes/:id/delete', requireAdmin, async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id);
    res.redirect('/admin/quotes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting quote');
  }
});

app.post('/contact', async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;

    if (!name || !phone) {
      return res.status(400).send(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 80px auto; text-align: center;">
          <h1 style="color: #dc2626;">Missing Information</h1>
          <p>Name and phone number are required.</p>
          <br>
          <a href="/contact" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
            Go Back
          </a>
        </div>
      `);
    }

    const newQuote = new Quote({
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      service: service || '',
      message: message ? message.trim() : ''
    });

    await newQuote.save();

    console.log('Quote saved:', name, phone);

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
  } catch (error) {
    console.error('Error saving quote:', error.message);
    res.status(500).send(`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 80px auto; text-align: center;">
        <h1 style="color: #dc2626;">Something went wrong</h1>
        <p>We could not save your request. Please try again or contact us on WhatsApp.</p>
        <br>
        <a href="https://wa.me/2348036045468" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-right: 10px;">
          WhatsApp Us
        </a>
        <a href="/contact" style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
          Try Again
        </a>
      </div>
    `);
  }
});
// 404 handler
app.use((req, res) => {
  res.status(404).send(`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 100px auto; text-align: center;">
      <h1 style="font-size: 72px; color: #16a34a; margin: 0;">404</h1>
      <h2 style="color: #111;">Page Not Found</h2>
      <p style="color: #6b7280;">The page you are looking for does not exist.</p>
      <br>
      <a href="/" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
        Back to Home
      </a>
    </div>
  `);
});
// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;