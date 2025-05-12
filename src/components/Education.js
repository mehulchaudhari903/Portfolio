import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaCalendarAlt, FaUniversity } from 'react-icons/fa';
import { ref, onValue } from 'firebase/database';
import { getFirebaseDatabase } from '../firebase/config';

const EducationContainer = styled.div`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #793aed 0%, #2e1065 100%);
  color: #FFFFFF;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto 4rem auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  margin-bottom: 1.5rem;
  color: #fff;
  font-weight: 600;
  letter-spacing: -1px;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.1rem);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const TimelineContainer = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 0;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: calc(100% - 100px);
    background: rgba(255, 255, 255, 0.1);

    @media (max-width: 768px) {
      left: 20px;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  justify-content: ${props => props.position === 'left' ? 'flex-start' : 'flex-end'};
  padding-left: ${props => props.position === 'right' ? '50%' : '0'};
  padding-right: ${props => props.position === 'left' ? '50%' : '0'};
  margin-bottom: 3rem;
  position: relative;
  
  @media (max-width: 768px) {
    padding-left: 50px;
    padding-right: 0;
    justify-content: flex-start;
    margin-bottom: 2rem;
  }
`;

const TimelineDot = styled(motion.div)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    left: 20px;
    width: 12px;
    height: 12px;
  }
`;

const TimelineContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 24px;
    ${props => props.position === 'left' ? 'right: -10px' : 'left: -10px'};
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.05);
    transform: rotate(45deg);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);

    @media (max-width: 768px) {
      left: -10px;
      top: 20px;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 1.5rem;
  }
`;

const EducationTitle = styled.h3`
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  margin-bottom: 0.8rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 600;

  svg {
    font-size: 1.2em;
    color: rgba(255, 255, 255, 0.9);
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const Institution = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.8rem;
  font-size: clamp(0.95rem, 2vw, 1.1rem);

  svg {
    color: rgba(255, 255, 255, 0.7);
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    font-size: 0.95rem;
  }
`;

const Duration = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: clamp(0.85rem, 1.5vw, 0.9rem);
  margin-bottom: 1.2rem;

  svg {
    color: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: clamp(0.9rem, 2vw, 1rem);

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #fff;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
`;

const NoEducationMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 2rem auto;
  max-width: 600px;

  h2 {
    font-size: 1.5rem;
    color: #fff;
    margin-bottom: 1rem;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const db = getFirebaseDatabase();
    const educationRef = ref(db, 'education');

    const unsubscribe = onValue(educationRef, 
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert Firebase object to array and filter active entries
          const educationArray = Object.entries(data)
            .map(([id, edu]) => ({
              id,
              ...edu
            }))
            .filter(edu => edu.status === "active")
            .sort((a, b) => {
              // Extract years from duration and compare the end years
              const aYear = parseInt(a.duration.split(' - ')[1]);
              const bYear = parseInt(b.duration.split(' - ')[1]);
              return bYear - aYear; // Sort in descending order (most recent first)
            });
          setEducation(educationArray);
        } else {
          setEducation([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching education data:', error);
        setError('Failed to load education data. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <EducationContainer id="education">
        <ContentWrapper>
          <LoadingSpinner>Loading education history...</LoadingSpinner>
        </ContentWrapper>
      </EducationContainer>
    );
  }

  if (error) {
    return (
      <EducationContainer id="education">
        <ContentWrapper>
          <ErrorMessage>{error}</ErrorMessage>
        </ContentWrapper>
      </EducationContainer>
    );
  }

  return (
    <EducationContainer id="education">
      <ContentWrapper>
        <HeaderSection>
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Education
          </Title>
          <Subtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            My educational background and academic achievements that have shaped my professional journey
          </Subtitle>
        </HeaderSection>

        <TimelineContainer>
          {education.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {education.map((item, index) => (
                <TimelineItem
                  key={item.id}
                  position={item.position}
                  variants={itemVariants}
                >
                  <TimelineDot
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: index * 0.3,
                      type: "spring",
                      stiffness: 200,
                      damping: 10
                    }}
                  />
                  <TimelineContent
                    position={item.position}
                    whileHover={{ 
                      scale: 1.02,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 15
                      }
                    }}
                  >
                    <EducationTitle>
                      <FaGraduationCap />
                      {item.title}
                    </EducationTitle>
                    <Institution>
                      <FaUniversity />
                      {item.institution}
                    </Institution>
                    <Duration>
                      <FaCalendarAlt />
                      {item.duration}
                    </Duration>
                    <Description>{item.description}</Description>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </motion.div>
          ) : (
            <NoEducationMessage>
              <h2>No Education History</h2>
              <p>Education details will be added soon.</p>
            </NoEducationMessage>
          )}
        </TimelineContainer>
      </ContentWrapper>
    </EducationContainer>
  );
};

export default Education; 