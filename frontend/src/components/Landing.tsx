import React from 'react';
import Home from './Home';
import About from './About';
import SuccessStories from './SuccessStories';
import SmartTools from './SmartTools';

const Landing: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <Home />
      
      {/* About Section */}
      <About />
      
      {/* Success Stories Section */}
      <section id="success-stories">
        <SuccessStories />
      </section>
      
      {/* Smart Tools Section - Unified Disease Detection, Loan Calculator, Government Schemes, Subsidies Tracker, Marketplace */}
      <section id="smart-tools">
        <SmartTools />
      </section>
    </div>
  );
};

export default Landing;