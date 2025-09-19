import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sprout, Users, TrendingUp, Leaf, TreePine, Wheat, Sun } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const Home: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const scrollToNextSection = () => {
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create initial particles
    const initialParticles: Particle[] = [];
    const colors = ['#10b981', '#06d6a0', '#118ab2', '#073b4c', '#ffd166'];
    
    for (let i = 0; i < 80; i++) {
      initialParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Animation loop with particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      initialParticles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Draw connections
        initialParticles.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (100 - distance) / 100 * 0.2;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const stats = [
    { icon: <Sprout className="h-8 w-8" />, value: '10,000+', label: 'Farmers Connected' },
    { icon: <Users className="h-8 w-8" />, value: '5,000+', label: 'Active Workers' },
    { icon: <TrendingUp className="h-8 w-8" />, value: '₹50L+', label: 'Revenue Generated' },
  ];

  const floatingIcons = [
    { icon: <Leaf className="h-12 w-12" />, delay: 0 },
    { icon: <TreePine className="h-12 w-12" />, delay: 0.2 },
    { icon: <Wheat className="h-12 w-12" />, delay: 0.4 },
    { icon: <Sun className="h-12 w-12" />, delay: 0.6 },
  ];

  return (
    <section id="home" className="min-h-screen relative overflow-hidden pt-16">
      {/* 3D Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-blue-900 to-purple-900">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: 'screen' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30" />
      </div>

      {/* Floating 3D Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 100, rotateY: 0 }}
            animate={{ 
              opacity: [0.3, 0.7, 0.3], 
              y: [-20, -100, -20],
              rotateY: [0, 360, 0],
              x: [0, 50, 0]
            }}
            transition={{
              duration: 8,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute text-green-300/40"
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + index * 10}%`,
              transform: `perspective(1000px) rotateX(15deg)`,
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-white max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="perspective-1000"
          >
            <motion.h1
              initial={{ opacity: 0, y: 50, rotateX: 45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="text-6xl md:text-8xl font-raleway font-bold mb-8 leading-tight"
              style={{
                background: 'linear-gradient(135deg, #ffffff, #10b981, #06d6a0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.3))',
                transform: 'perspective(500px) rotateX(10deg)',
              }}
            >
              I.F.C
              <motion.span 
                className="block text-4xl md:text-5xl mt-4 font-raleway font-semibold"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                style={{
                  background: 'linear-gradient(45deg, #ffd166, #f77f00)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                India Farmers Club
              </motion.span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl md:text-3xl mb-12 text-gray-100 max-w-4xl mx-auto font-raleway font-light"
              style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}
            >
              Empowering farmers with cutting-edge technology, connecting communities globally, 
              and revolutionizing agriculture for a sustainable future.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotateY: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative group px-10 py-5 rounded-full text-lg font-raleway font-semibold transition-all duration-500 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(6, 214, 160, 0.8))',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                  transform: 'perspective(500px) rotateX(5deg)',
                }}
              >
                <span className="relative z-10 text-white">Explore Platform</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, rotateY: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('announcements')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative group px-10 py-5 rounded-full text-lg font-raleway font-semibold transition-all duration-500 overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
                  transform: 'perspective(500px) rotateX(5deg)',
                }}
              >
                <span className="relative z-10 text-white">Latest Updates</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* 3D Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 perspective-1000"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100, rotateY: 45 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 1.2 + index * 0.2 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 10,
                  z: 50,
                }}
                className="relative group"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  transform: 'perspective(1000px) rotateX(10deg)',
                }}
              >
                <div className="p-8 text-center relative z-10">
                  <motion.div 
                    className="flex justify-center mb-6 text-green-400"
                    whileHover={{ rotateY: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold mb-3 text-white"
                    style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-300 text-lg">{stat.label}</div>
                </div>
                
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          >
            <motion.button
              onClick={scrollToNextSection}
              whileHover={{ scale: 1.2 }}
              className="relative group"
            >
              <motion.div
                animate={{ 
                  y: [0, 20, 0],
                  rotateX: [0, 360, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-white group-hover:text-green-400 transition-colors duration-300"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.6))',
                  transform: 'perspective(100px) rotateX(15deg)',
                }}
              >
                <ArrowDown className="h-8 w-8" />
              </motion.div>
              
              {/* Pulsing ring */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border-2 border-green-400 rounded-full"
              />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Additional floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.5, 0.5],
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 bg-green-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Home;