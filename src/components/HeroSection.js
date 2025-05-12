import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { toast } from 'react-toastify';
import { ref, onValue } from 'firebase/database';
import { getFirebaseDatabase } from '../firebase/config';

// Styled Components (same as previous, included for completeness)
const HeroContainer = styled.div`
  background: #f8f7ff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  min-height: 100vh;
  position: relative;
  z-index: 1;
  overflow-x: hidden;

  @media screen and (max-width: 768px) {
    padding: 0 15px;
  }
`;

const HeroWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  padding: 0 24px;
  margin: 100px 0;

  @media screen and (max-width: 968px) {
    flex-direction: column-reverse;
    text-align: center;
    padding: 0 15px;
    margin: 80px 0;
  }
`;

const HeroLeft = styled.div`
  flex: 1;
  padding-right: 64px;

  @media screen and (max-width: 1200px) {
    padding-right: 32px;
  }

  @media screen and (max-width: 968px) {
    padding-right: 0;
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const HeroRight = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 968px) {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 768px) {
    max-width: 400px;
  }

  @media screen and (max-width: 480px) {
    max-width: 300px;
  }
`;

const MotionImage = motion.img;

const MainImage = styled(MotionImage)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  position: relative;
  z-index: 2;
  aspect-ratio: 1/1;
  max-height: 500px;
  min-height: 300px;

  @media screen and (max-width: 768px) {
    max-height: 400px;
    min-height: 250px;
  }

  @media screen and (max-width: 480px) {
    max-height: 300px;
    min-height: 200px;
  }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-10px) translateX(5px); }
  100% { transform: translateY(0) translateX(0); }
`;

const WelcomeText = styled(motion.p)`
  color: #6c63ff;
  font-size: clamp(16px, 2vw, 20px);
  margin-bottom: 8px;
  font-weight: 500;

  @media screen and (max-width: 768px) {
    font-size: 16px;
  }
`;

const HeroH1 = styled(motion.h1)`
  color: #2d2d2d;
  font-size: clamp(32px, 4vw, 60px);
  margin-bottom: 16px;
  line-height: 1.2;

  span {
    color: #6c63ff;
    font-weight: 700;
  }

  @media screen and (max-width: 968px) {
    font-size: 42px;
  }

  @media screen and (max-width: 768px) {
    font-size: 36px;
  }

  @media screen and (max-width: 480px) {
    font-size: 28px;
  }
`;

const HeroP = styled(motion.p)`
  color: #666;
  font-size: clamp(16px, 1.5vw, 18px);
  line-height: 1.6;
  margin-bottom: 32px;
  max-width: 600px;

  @media screen and (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 24px;
  }

  @media screen and (max-width: 480px) {
    font-size: 15px;
    line-height: 1.5;
  }
`;

const ButtonWrapper = styled(motion.div)`
  display: flex;
  gap: 16px;

  @media screen and (max-width: 968px) {
    justify-content: center;
  }

  @media screen and (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 280px;
  }
`;

const PrimaryButton = styled(motion.button)`
  background: #6c63ff;
  color: white;
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: clamp(14px, 1.5vw, 16px);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #5a52d4;
    transform: translateY(-2px);
  }

  @media screen and (max-width: 768px) {
    padding: 10px 28px;
    font-size: 15px;
  }

  @media screen and (max-width: 480px) {
    width: 100%;
    padding: 12px 20px;
  }
`;

const SecondaryButton = styled(motion.button)`
  background: transparent;
  color: #6c63ff;
  padding: 12px 32px;
  border: 2px solid #6c63ff;
  border-radius: 8px;
  font-size: clamp(14px, 1.5vw, 16px);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(108, 99, 255, 0.1);
    transform: translateY(-2px);
  }

  @media screen and (max-width: 768px) {
    padding: 10px 28px;
    font-size: 15px;
  }

  @media screen and (max-width: 480px) {
    width: 100%;
    padding: 12px 20px;
  }
`;

const BackgroundShape = styled.div`
  position: absolute;
  top: 20px;
  right: -20px;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #6c63ff, #4a42d1);
  border-radius: 20px;
  z-index: 1;

  @media screen and (max-width: 480px) {
    top: 15px;
    right: -15px;
  }
`;

const Dots = styled.div`
  position: absolute;
  top: -30px;
  right: -30px;
  width: 100px;
  height: 100px;
  background-image: radial-gradient(#6c63ff 2px, transparent 2px);
  background-size: 10px 10px;
  z-index: 1;
  animation: ${floatAnimation} 3s ease-in-out infinite;

  @media screen and (max-width: 768px) {
    width: 80px;
    height: 80px;
    top: -20px;
    right: -20px;
  }

  @media screen and (max-width: 480px) {
    width: 60px;
    height: 60px;
    top: -15px;
    right: -15px;
  }
`;

const Wave = styled.div`
  position: absolute;
  left: -60px;
  top: 50%;
  width: 50px;
  height: 20px;
  background: linear-gradient(45deg, transparent, transparent 49%, #6c63ff 49%, #6c63ff 51%, transparent 51%, transparent);
  background-size: 20px 20px;
  z-index: 1;

  @media screen and (max-width: 768px) {
    left: -40px;
    width: 40px;
  }

  @media screen and (max-width: 480px) {
    left: -30px;
    width: 30px;
  }
`;

const TypewriterWrapper = styled.div`
  display: inline-block;
  color: #471d95;
  font-weight: 600;
  margin-top: 8px;

  .Typewriter__wrapper {
    color: #471d95;
    font-weight: 600;
  }

  .Typewriter__cursor {
    color: #471d95;
  }
`;

// Skeleton Loader Styles
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonLoader = styled.div`
  background: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 8px;
`;

const SkeletonText = styled(SkeletonLoader)`
  height: 20px;
  width: 60%;
  margin-bottom: 16px;

  @media screen and (max-width: 768px) {
    width: 80%;
  }
`;

const SkeletonTitle = styled(SkeletonLoader)`
  height: 40px;
  width: 80%;
  margin-bottom: 16px;

  @media screen and (max-width: 768px) {
    height: 32px;
    width: 90%;
  }
`;

const SkeletonParagraph = styled(SkeletonLoader)`
  height: 16px;
  width: 100%;
  margin-bottom: 12px;

  &:last-child {
    width: 80%;
  }
`;

const SkeletonButton = styled(SkeletonLoader)`
  height: 48px;
  width: 120px;
  border-radius: 8px;

  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const SkeletonImage = styled(SkeletonLoader)`
  width: 100%;
  max-width: 500px;
  height: 100%;
  aspect-ratio: 1/1;
  max-height: 500px;
  min-height: 300px;
  border-radius: 20px;

  @media screen and (max-width: 768px) {
    max-height: 400px;
    min-height: 250px;
  }

  @media screen and (max-width: 480px) {
    max-height: 300px;
    min-height: 200px;
  }
`;

const SkeletonButtonWrapper = styled.div`
  display: flex;
  gap: 16px;

  @media screen and (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 280px;
  }
`;

// HeroSection Component
const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [portfolioData, setPortfolioData] = useState({
    customer: '',
    description: '',
    images: [],
    skills: [],
  });
  const [loading, setLoading] = useState(true); // New loading state

  // Fallback images
  const fallbackImages = useMemo(() => ['', ''], []);

  // Fetch data from Firebase
  useEffect(() => {
    setLoading(true); // Set loading to true when fetching starts
    const db = getFirebaseDatabase();
    const portfolioRef = ref(db, 'Homepage');

    onValue(
      portfolioRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const activePortfolio = Object.values(data).find(
            (portfolio) => portfolio.status === 'active'
          );
          if (activePortfolio) {
            setPortfolioData({
              customer: activePortfolio.customer || 'Mehul Chaudhari',
              description:
                activePortfolio.description ||
                'Welcome to my portfolio, where innovation meets web development. Explore my projects and skills.',
              images:
                activePortfolio.images && activePortfolio.images.length > 0
                  ? activePortfolio.images
                  : fallbackImages,
              skills:
                activePortfolio.skills && activePortfolio.skills.length > 0
                  ? activePortfolio.skills
                  : ['JavaScript', 'React', 'Node.js'],
            });
          } else {
            toast.warn('No active portfolio found', {
              position: 'top-right',
              autoClose: 3000,
            });
            setPortfolioData({
              customer: 'Mehul Chaudhari',
              description: 'Welcome to my portfolio!',
              images: fallbackImages,
              skills: ['JavaScript', 'React', 'Node.js'],
            });
          }
        } else {
          toast.warn('No portfolio data found', {
            position: 'top-right',
            autoClose: 3000,
          });
          setPortfolioData({
            customer: 'Mehul Chaudhari',
            description: 'Welcome to my portfolio!',
            images: fallbackImages,
            skills: ['JavaScript', 'React', 'Node.js'],
          });
        }
        setLoading(false); // Set loading to false when data is fetched
      },
      (error) => {
        toast.error('Failed to load portfolio data', {
          position: 'top-right',
          autoClose: 3000,
        });
        setPortfolioData({
          customer: 'Mehul Chaudhari',
          description: 'Welcome to my portfolio!',
          images: fallbackImages,
          skills: ['JavaScript', 'React', 'Node.js'],
        });
        setLoading(false); // Set loading to false on error
      }
    );
  }, [fallbackImages]);

  // Rotate images every 5 seconds
  useEffect(() => {
    if (portfolioData.images.length === 0 || loading) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % portfolioData.images.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [portfolioData.images, loading]);

  // Handle image load errors
  const handleImageError = () => {
    toast.error('Failed to load image', {
      position: 'top-right',
      autoClose: 3000,
    });
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % portfolioData.images.length
    );
  };

  return (
    <HeroContainer id="home">
      <HeroWrapper>
        <HeroLeft>
          {loading ? (
            <>
              <SkeletonText />
              <SkeletonTitle />
              <SkeletonParagraph />
              <SkeletonParagraph />
              <SkeletonButtonWrapper>
                <SkeletonButton />
                <SkeletonButton />
              </SkeletonButtonWrapper>
            </>
          ) : (
            <>
              <WelcomeText
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Welcome To My Portfolio
              </WelcomeText>
              <HeroH1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                I am <span>{portfolioData.customer}</span>
                <br />
                <TypewriterWrapper>
                  <Typewriter
                    options={{
                      strings: portfolioData.skills,
                      autoStart: true,
                      loop: true,
                      delay: 50,
                      deleteSpeed: 30,
                      cursor: '_',
                    }}
                  />
                </TypewriterWrapper>
              </HeroH1>
              <HeroP
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {portfolioData.description}
              </HeroP>
              <ButtonWrapper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link to="/resume" aria-label="View Resume">
                  <PrimaryButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Resume CV
                  </PrimaryButton>
                </Link>
                <Link to="/contact" aria-label="Contact Me">
                  <SecondaryButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Contact Me
                  </SecondaryButton>
                </Link>
              </ButtonWrapper>
            </>
          )}
        </HeroLeft>
        <HeroRight>
          <ImageWrapper>
            {loading ? (
              <SkeletonImage />
            ) : portfolioData.images.length > 0 ? (
              <MainImage
                src={portfolioData.images[currentImageIndex]}
                alt={`Portfolio image ${currentImageIndex + 1} for ${portfolioData.customer}`}
                onError={handleImageError}
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                loading="lazy"
              />
            ) : (
              <MainImage
                src={fallbackImages[0]}
                alt="Fallback portfolio image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                loading="lazy"
              />
            )}
            <BackgroundShape />
            <Dots />
            <Wave />
          </ImageWrapper>
        </HeroRight>
      </HeroWrapper>
    </HeroContainer>
  );
};

export default HeroSection;