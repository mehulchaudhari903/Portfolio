import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const glow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 2px rgb(255, 255, 255)) drop-shadow(0 0 6px rgb(255, 255, 255));
  }
  50% {
    filter: drop-shadow(0 0 1px rgb(255, 255, 255)) drop-shadow(0 0 4px rgb(255, 255, 255));
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const gradientMove = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const particleFloat = keyframes`
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-15px) translateX(15px);
  }
  50% {
    transform: translateY(-25px) translateX(0);
  }
  75% {
    transform: translateY(-15px) translateX(-15px);
  }
`;

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  overflow: hidden;
  position: relative;
  background: linear-gradient(327deg, #9963fd 0%, #2e1065 100%);
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, transparent 0%, rgba(46, 16, 101, 0.3) 100%);
    z-index: -1;
  }
`;

const Particle = styled.div`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: rgba(146, 92, 246, 0.1);
  border-radius: 50%;
  top: ${props => props.$top}%;
  left: ${props => props.$left}%;
  animation: ${particleFloat} ${props => props.$duration}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
`;

const GridPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(rgba(146, 92, 246, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(146, 92, 246, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: -1;
  opacity: 0.3;
`;

const ErrorWrapper = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  animation: ${float} 4s ease-in-out infinite;
`;

const LightBulb = styled(motion.div)`
  width: 120px;
  height: 120px;
  border: 4px solid rgb(255, 255, 255);
  border-radius: 50%;
  position: relative;
  animation: ${glow} 3s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
    width: 35px;
    height: 35px;
    border: 4px solid rgb(255, 255, 255);
    border-radius: 5px 5px 0 0;
    border-bottom: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 50px;
    background: rgb(255, 255, 255);
    border-radius: 2px;
  }
`;

const Shine = styled(motion.div)`
  position: absolute;
  top: 15px;
  right: 25px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 3px solid rgb(255, 255, 255);
  opacity: 0.8;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const ErrorCode = styled(motion.h1)`
  font-size: clamp(4rem, 15vw, 8rem);
  color: #ffffff;
  margin: 0;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  letter-spacing: 2px;
  background: linear-gradient(
    90deg,
    #ffffff 0%,
    #e0e0e0 50%,
    #ffffff 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 4s linear infinite;
`;

const ErrorMessage = styled(motion.h2)`
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: #ffffff;
  font-weight: 500;
  letter-spacing: 3px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 2px;
    background: #ffffff;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.1rem;
  color: #ffffff;
  max-width: 400px;
  margin: 2rem auto;
  line-height: 1.8;
  letter-spacing: 0.5px;
  opacity: 0.9;
  transform-origin: center;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.02);
  }
`;

const MotionLink = motion.create(Link);
const HomeLink = styled(MotionLink)`
  display: inline-block;
  padding: 1rem 2.5rem;
  background: transparent;
  color: #ffffff;
  text-decoration: none;
  border: 2px solid #ffffff;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  letter-spacing: 1px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover {
    background: #ffffff;
    color: #2e1065;
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);

    &::before {
      left: 100%;
    }
  }
`;

const NotFound = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    size: Math.random() * 40 + 20,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 4 + 6,
    delay: Math.random() * 2
  }));

  return (
    <NotFoundContainer>
      {particles.map((particle, index) => (
        <Particle
          key={index}
          $size={particle.size}
          $top={particle.top}
          $left={particle.left}
          $duration={particle.duration}
          $delay={particle.delay}
        />
      ))}
      <GridPattern />
      <ErrorWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ErrorCode>
          4
          <LightBulb
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2 
            }}
          >
            <Shine />
          </LightBulb>
          4
        </ErrorCode>
      </ErrorWrapper>
      <ErrorMessage
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        PAGE NOT FOUND
      </ErrorMessage>
      <Description
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Looks like this bulb has burned out! The page you're looking for 
        doesn't exist or has been moved.
      </Description>
      <HomeLink
        to="/"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Return to Home
      </HomeLink>
    </NotFoundContainer>
  );
};

export default NotFound; 