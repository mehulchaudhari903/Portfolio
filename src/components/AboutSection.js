import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBehance, FaDribbble, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaLink } from 'react-icons/fa';
import { ref, onValue, off } from 'firebase/database';
import { getFirebaseDatabase } from '../firebase/config';
import PropTypes from 'prop-types';

// Styled components (unchanged)
const AboutContainer = styled.div`
  background: #ffffff;
  padding: 80px 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  @media screen and (max-width: 768px) {
    padding: 100px 29px;
  }
`;

const AboutWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 60px;
  align-items: center;
  max-width: 1200px;
  width: 100%;

  @media screen and (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ImgWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;

  @media screen and (max-width: 968px) {
    max-width: 400px;
    margin: 0 auto;
  }
`;

const Img = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: multiply;
`;

const TextWrapper = styled.div`
  @media screen and (max-width: 968px) {
    text-align: center;
  }
`;

const Heading = styled(motion.h2)`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
  text-transform: uppercase;
`;

const SubHeading = styled(motion.h3)`
  font-size: 1.25rem;
  font-weight: 600;
  color: #6c63ff;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Description = styled(motion.p)`
  font-size: 1rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 32px;
  max-width: 600px;

  @media screen and (max-width: 968px) {
    margin: 0 auto 32px;
  }
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: 20px;
  margin-top: 32px;

  @media screen and (max-width: 968px) {
    justify-content: center;
  }
`;

const SocialIcon = styled(motion.a)`
  color: #333;
  font-size: 24px;
  transition: color 0.3s ease;

  &:hover {
    color: #6c63ff;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.5rem;
  color: #333;
`;

const Skeleton = styled.div`
  background: #e0e0e0;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const ErrorContainer = styled(LoadingContainer)`
  color: #ff4d4d;
`;

const InactiveContainer = styled(LoadingContainer)`
  color: #666;
`;

const AboutSection = ({ firebasePath = 'Aboutspage' }) => {
  const [aboutContent, setAboutContent] = useState({
    Name: '',
    Profession: '',
    Description: '',
    Image: '',
    SocialMedia: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(true);

  // Function to infer social media platform from URL
  const inferSocialMediaLabel = (url) => {
    if (!url) return 'link'; // Use 'link' for invalid or empty URLs
    const normalizedUrl = url.toLowerCase();
    if (normalizedUrl.includes('behance.net')) return 'behance';
    if (normalizedUrl.includes('dribbble.com')) return 'dribbble';
    if (normalizedUrl.includes('twitter.com') || normalizedUrl.includes('x.com')) return 'twitter';
    if (normalizedUrl.includes('instagram.com')) return 'instagram';
    if (normalizedUrl.includes('linkedin.com')) return 'linkedin';
    if (normalizedUrl.includes('github.com')) return 'github';
    return 'link'; // Default to 'link' for unrecognized URLs
  };

  // Define getIconComponent
  const getIconComponent = (label) => {
    if (!label) return <FaLink />; // Fallback for null/undefined label
    const normalizedLabel = label.toLowerCase().trim();
    switch (normalizedLabel) {
      case 'behance':
        return <FaBehance />;
      case 'dribbble':
        return <FaDribbble />;
      case 'twitter':
        return <FaTwitter />;
      case 'instagram':
        return <FaInstagram />;
      case 'linkedin':
        return <FaLinkedin />;
      case 'github':
        return <FaGithub />;
      case 'link':
      default:
        return <FaLink />;
    }
  };

  // Memoize social media with icons
  const socialMediaWithIcons = useMemo(() => {
    const socialMedia = aboutContent.SocialMedia;
    if (!Array.isArray(socialMedia)) return [];

    return socialMedia.map((item, index) => {
      // Handle both object and string formats
      const isObject = typeof item === 'object' && item !== null;
      const url = isObject ? item.url : item;
      const label = isObject ? item.label || inferSocialMediaLabel(item.url) : inferSocialMediaLabel(item);
      const id = isObject && item.id ? item.id : `social-${index}`;

      return {
        id,
        url,
        label,
        icon: getIconComponent(label),
      };
    }).filter((item) => item.url); // Only require valid URLs
  }, [aboutContent.SocialMedia]);

  useEffect(() => {
    const db = getFirebaseDatabase();
    const aboutRef = ref(db, firebasePath);

    const unsubscribe = onValue(
      aboutRef,
      (snapshot) => {
        const data = snapshot.val();
        

        if (!data) {
          console.error('No data found at', firebasePath);
          setAboutContent({
            Name: 'Mehul Chaudhari',
            Profession: 'Developer',
            Description: 'A React.js portfolio is a single-page application (SPA) or multi-page site that highlights a developer` s work, skills, and personality. It uses React’s reusable components, state management, and routing to deliver a fast, seamless user experience. The portfolio is typically hosted on platforms like Vercel, Netlify, or GitHub Pages and is optimized for performance and SEO.',
            Image: '/profile-silhouette.jpg',
            SocialMedia: [],
          });
          setIsActive(false);
          setIsLoading(false);
          return;
        }

        // Convert object to array if data is an object
        const dataArray = typeof data === 'object' && !Array.isArray(data) ? Object.values(data) : data;

        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          console.error('Data is not an array or is empty at', firebasePath);
          setAboutContent({
            Name: 'Mehul Chaudhari',
            Profession: 'Developer',
            Description: 'Default description',
            Image: '/profile-silhouette.jpg',
            SocialMedia: [],
          });
          setIsActive(false);
          setIsLoading(false);
          return;
        }

        const activeItem = dataArray.find((item) => item.status === 'active');
      

        if (!activeItem) {
          console.warn('No active content found in array');
          setAboutContent({
            Name: 'Mehul Chaudhari',
            Profession: 'Developer',
            Description: 'Content is currently inactive.',
            Image: '/profile-silhouette.jpg',
            SocialMedia: [],
          });
          setIsActive(false);
          setIsLoading(false);
          return;
        }

        // Handle socialMediaLinks or Social Media, with fallback to empty array
        const socialMedia = Array.isArray(activeItem.socialMediaLinks || activeItem['Social Media'])
          ? activeItem.socialMediaLinks || activeItem['Social Media']
          : [];

        setAboutContent({
          Name: activeItem.name || 'Mehul Chaudhari',
          Profession: activeItem.profession || 'Developer',
          Description: activeItem.description || 'Default description',
          Image: activeItem.image || '/profile-silhouette.jpg',
          SocialMedia: socialMedia,
        });
        setIsActive(true);
        setIsLoading(false);
      },
      (error) => {
        console.error('Firebase error:', error);
        setError(`Failed to load content: ${error.message}`);
        setAboutContent({
          Name: 'Mehul Chaudhari',
          Profession: 'Developer',
          Description: 'Failed to load description',
          Image: '/profile-silhouette.jpg',
          SocialMedia: [],
        });
        setIsActive(false);
        setIsLoading(false);
      }
    );

    return () => {
      off(aboutRef);
      unsubscribe();
    };
  }, [firebasePath]);

  if (error) {
    return <ErrorContainer>{error}</ErrorContainer>;
  }

  if (isLoading) {
    return (
      <AboutContainer>
        <AboutWrapper>
          <ImgWrap>
            <Skeleton style={{ width: '100%', height: '100%' }} />
          </ImgWrap>
          <TextWrapper>
            <Skeleton style={{ width: '60%', height: '40px', marginBottom: '24px' }} />
            <Skeleton style={{ width: '40%', height: '20px', marginBottom: '24px' }} />
            <Skeleton style={{ width: '80%', height: '100px', marginBottom: '32px' }} />
            <Skeleton style={{ width: '30%', height: '24px' }} />
          </TextWrapper>
        </AboutWrapper>
      </AboutContainer>
    );
  }

  if (!isActive) {
    return <InactiveContainer>Content is currently inactive.</InactiveContainer>;
  }

  return (
    <AboutContainer id="about" role="region" aria-labelledby="about-heading">
      <AboutWrapper>
        <ImgWrap>
          <Img
            src={aboutContent.Image}
            alt="Profile Image"
            loading="lazy"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          />
        </ImgWrap>
        <TextWrapper>
          <Heading
            id="about-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            About Me
          </Heading>
          <SubHeading
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {aboutContent.Name} - {aboutContent.Profession}
          </SubHeading>
          <Description
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {aboutContent.Description}
          </Description>
          <SocialLinks
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {socialMediaWithIcons.map((link) => (
              <SocialIcon
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={link.label || 'Social Media'}
              >
                {link.icon}
              </SocialIcon>
            ))}
          </SocialLinks>
        </TextWrapper>
      </AboutWrapper>
    </AboutContainer>
  );
};

AboutSection.propTypes = {
  firebasePath: PropTypes.string,
};

export default AboutSection;