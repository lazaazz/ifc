const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Submit success story
router.post('/submit', async (req, res) => {
  try {
    const {
      fullName,
      age,
      location,
      farmSize,
      farmType,
      storyTitle,
      challengesFaced,
      solutionsImplemented,
      resultsAchieved,
      adviceToOthers,
      contactEmail,
      contactPhone,
      allowContact,
      allowPublish
    } = req.body;

    // Validation
    if (!fullName || !location || !storyTitle || !challengesFaced || !solutionsImplemented || !resultsAchieved) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (contactEmail && !emailRegex.test(contactEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #059669; border-bottom: 2px solid #22c55e; padding-bottom: 5px; }
          .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 20px; }
          .info-item { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .info-label { font-weight: bold; color: #374151; }
          .info-value { color: #6b7280; margin-top: 5px; }
          .story-content { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .footer { margin-top: 30px; padding: 20px; background: #374151; color: white; text-align: center; border-radius: 8px; }
          .highlight { background: #dcfce7; padding: 3px 6px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌾 New Success Story Submission</h1>
            <p>I.F.C - Indian Farming Community</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>📋 Farmer Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Full Name</div>
                  <div class="info-value">${fullName}</div>
                </div>
                ${age ? `
                <div class="info-item">
                  <div class="info-label">Age</div>
                  <div class="info-value">${age} years</div>
                </div>
                ` : ''}
                <div class="info-item">
                  <div class="info-label">Location</div>
                  <div class="info-value">${location}</div>
                </div>
                ${farmSize ? `
                <div class="info-item">
                  <div class="info-label">Farm Size</div>
                  <div class="info-value">${farmSize}</div>
                </div>
                ` : ''}
                ${farmType ? `
                <div class="info-item">
                  <div class="info-label">Farm Type</div>
                  <div class="info-value">${farmType}</div>
                </div>
                ` : ''}
              </div>
            </div>

            <div class="section">
              <h3>📖 Success Story</h3>
              <div class="story-content">
                <h4 style="color: #059669; margin-top: 0;">${storyTitle}</h4>
                
                <h5>🚧 Challenges Faced:</h5>
                <p>${challengesFaced}</p>
                
                <h5>💡 Solutions Implemented:</h5>
                <p>${solutionsImplemented}</p>
                
                <h5>🎯 Results Achieved:</h5>
                <p>${resultsAchieved}</p>
                
                ${adviceToOthers ? `
                <h5>💬 Advice to Other Farmers:</h5>
                <p><em>"${adviceToOthers}"</em></p>
                ` : ''}
              </div>
            </div>

            <div class="section">
              <h3>📞 Contact Information</h3>
              <div class="info-grid">
                ${contactEmail ? `
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${contactEmail}</div>
                </div>
                ` : ''}
                ${contactPhone ? `
                <div class="info-item">
                  <div class="info-label">Phone</div>
                  <div class="info-value">${contactPhone}</div>
                </div>
                ` : ''}
                <div class="info-item">
                  <div class="info-label">Allow Contact</div>
                  <div class="info-value">
                    <span class="highlight">${allowContact ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-label">Allow Publishing</div>
                  <div class="info-value">
                    <span class="highlight">${allowPublish ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>📅 Submitted on: ${new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p>🌐 I.F.C Platform - Empowering Indian Farmers</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: 'akmalalaam30@gmail.com',
      subject: `🌾 New Success Story: ${storyTitle} - ${fullName}`,
      html: htmlContent,
      text: `
        New Success Story Submission
        
        Farmer: ${fullName}
        Location: ${location}
        Story Title: ${storyTitle}
        
        Challenges: ${challengesFaced}
        Solutions: ${solutionsImplemented}
        Results: ${resultsAchieved}
        
        Contact: ${contactEmail || 'Not provided'} | ${contactPhone || 'Not provided'}
        Allow Contact: ${allowContact ? 'Yes' : 'No'}
        Allow Publishing: ${allowPublish ? 'Yes' : 'No'}
        
        Submitted on: ${new Date().toLocaleString('en-IN')}
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Success story submitted successfully! Thank you for sharing your journey.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Success story submission error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to submit success story. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get submission guidelines
router.get('/guidelines', (req, res) => {
  res.json({
    success: true,
    guidelines: {
      title: "Share Your Success Story",
      description: "Help inspire other farmers by sharing your journey, challenges, and achievements.",
      requirements: [
        "Provide accurate information about your farming experience",
        "Share specific challenges you faced and how you overcame them",
        "Describe the results and impact of your solutions",
        "Include your location for geographical context",
        "Respect privacy - only share what you're comfortable with"
      ],
      tips: [
        "Be detailed about your solutions - other farmers can learn from your approach",
        "Include numbers and metrics if possible (yield increase, cost savings, etc.)",
        "Mention any government schemes or programs that helped you",
        "Share advice that you would give to fellow farmers",
        "Your story can motivate others facing similar challenges"
      ],
      privacy: [
        "You control whether your contact information can be shared",
        "You decide if your story can be published on the platform",
        "We respect your privacy and will not share personal details without permission",
        "Your email will only be used for story-related communication if you allow it"
      ]
    }
  });
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Success Stories API is running',
    emailConfigured: !!(process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;