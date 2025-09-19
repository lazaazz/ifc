import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface ParticleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}

const ParticleButton: React.FC<ParticleButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  variant = 'primary'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [nextId, setNextId] = useState(0);

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white',
    warning: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white'
  };

  const createParticle = React.useCallback((centerX: number, centerY: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    const life = Math.random() * 60 + 40;
    
    return {
      id: nextId,
      x: centerX + (Math.random() - 0.5) * 20,
      y: centerY + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - Math.random() * 2,
      life: life,
      maxLife: life,
      size: Math.random() * 4 + 2
    };
  }, [nextId]);

  const spawnParticles = (event: React.MouseEvent) => {
    if (disabled) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = event.clientX - rect.left;
    const centerY = event.clientY - rect.top;
    
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push(createParticle(centerX, centerY));
      setNextId(prev => prev + 1);
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const updateParticles = () => {
    setParticles(prev => 
      prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1, // gravity
          life: particle.life - 1
        }))
        .filter(particle => particle.life > 0)
    );
  };

  useEffect(() => {
    if (isHovered && !disabled) {
      const interval = setInterval(updateParticles, 16); // 60fps
      return () => clearInterval(interval);
    }
  }, [isHovered, disabled]);

  useEffect(() => {
    if (isHovered && !disabled) {
      const particleInterval = setInterval(() => {
        const newParticles: Particle[] = [];
        for (let i = 0; i < 2; i++) {
          newParticles.push(createParticle(
            Math.random() * 200 + 50, 
            Math.random() * 40 + 20
          ));
          setNextId(prev => prev + 1);
        }
        setParticles(prev => [...prev, ...newParticles]);
      }, 100);
      
      return () => clearInterval(particleInterval);
    }
  }, [isHovered, disabled, createParticle]);

  return (
    <motion.div 
      className="relative inline-block"
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          relative px-6 py-3 rounded-xl font-medium transition-all duration-300
          shadow-lg hover:shadow-xl transform-gpu overflow-hidden
          border border-transparent hover:border-white/20
          ${variantStyles[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        onMouseEnter={(e) => {
          setIsHovered(true);
          spawnParticles(e);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setParticles([]);
        }}
        onMouseMove={spawnParticles}
        whileHover={disabled ? {} : {
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.8)'
        }}
      >
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-xl blur-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered && !disabled ? 1 : 0,
            scale: isHovered && !disabled ? 1.2 : 0.8
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Particle container */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                background: `radial-gradient(circle, 
                  rgba(34, 197, 94, ${particle.life / particle.maxLife}) 0%, 
                  rgba(16, 185, 129, ${particle.life / particle.maxLife * 0.8}) 50%, 
                  rgba(5, 150, 105, ${particle.life / particle.maxLife * 0.6}) 100%
                )`,
                boxShadow: `0 0 ${particle.size * 2}px rgba(34, 197, 94, ${particle.life / particle.maxLife * 0.8})`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: particle.life / particle.maxLife,
              }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%', skewX: -45 }}
          animate={isHovered && !disabled ? { 
            x: '200%',
            transition: { 
              duration: 0.8, 
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 1
            }
          } : { x: '-100%' }}
        />

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>

        {/* Ripple effect on click */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-xl"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ 
            scale: 2, 
            opacity: [0, 0.3, 0],
            transition: { duration: 0.4 }
          }}
        />
      </motion.button>

      {/* Floating particles around button */}
      {isHovered && !disabled && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`floating-${i}`}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-10, -30, -10],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ParticleButton;