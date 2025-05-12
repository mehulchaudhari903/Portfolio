import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaReact, FaHtml5, FaCss3Alt, FaJsSquare, FaPython, FaSketch } from 'react-icons/fa';
import { SiTailwindcss, SiFlutter } from 'react-icons/si';
import { ref, onValue } from 'firebase/database';
import { getFirebaseDatabase } from '../firebase/config';

const SkillsContainer = styled.div`
  padding: 6rem 2rem;
  background: linear-gradient(327deg, #9963fd 0%, #2e1065 100%);
  color: #FFFFFF;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const SkillsTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  margin-bottom: 1.5rem;
  color: #fff;
  font-weight: 600;
  text-align: center;
`;

const SkillsSubtitle = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.1rem);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const SkillsContent = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 4rem;
  width: 100%;

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  flex: 1;
  max-width: 700px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: 100%;
  }
`;

const SkillItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SkillName = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: #fff;
`;

const SkillPercent = styled.span`
  color: #fff;
  font-weight: 500;
`;

const SkillBar = styled.div`
  height: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  overflow: hidden;
`;

const SkillProgress = styled(motion.div)`
  height: 100%;
  background: #fff;
  border-radius: 4px;
`;

const IconsGrid = styled.div`
  position: relative;
  flex: 1;
  min-height: 400px;
  background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  border-radius: 15px;

  @media (max-width: 992px) {
    min-height: 300px;
    width: 100%;
    max-width: 500px;
  }
`;

const IconBox = styled(motion.div)`
  position: absolute;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
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

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const db = getFirebaseDatabase();
    const skillsRef = ref(db, 'skills');
    const iconsRef = ref(db, 'skillIcons');

    const unsubscribeSkills = onValue(skillsRef, 
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const skillsArray = Object.entries(data)
            .map(([id, skill]) => ({
              id,
              ...skill
            }))
            .filter(skill => skill.status === "active");
          setSkills(skillsArray);
        } else {
          setSkills([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching skills data:', error);
        setError('Failed to load skills data. Please try again later.');
        setLoading(false);
      }
    );

    const unsubscribeIcons = onValue(iconsRef, 
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const iconsArray = Object.entries(data)
            .map(([id, icon]) => ({
              id,
              ...icon
            }))
            .filter(icon => icon.status === "active");
          setIcons(iconsArray);
        } else {
          setIcons([]);
        }
      },
      (error) => {
        console.error('Error fetching icons data:', error);
      }
    );

    return () => {
      unsubscribeSkills();
      unsubscribeIcons();
    };
  }, []);

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'SiFlutter': return <SiFlutter />;
      case 'FaSketch': return <FaSketch />;
      case 'FaJsSquare': return <FaJsSquare />;
      case 'FaReact': return <FaReact />;
      case 'FaCss3Alt': return <FaCss3Alt />;
      case 'FaHtml5': return <FaHtml5 />;
      case 'SiTailwindcss': return <SiTailwindcss />;
      case 'FaPython': return <FaPython />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <SkillsContainer id="skills">
        <ContentWrapper>
          <LoadingSpinner>Loading skills...</LoadingSpinner>
        </ContentWrapper>
      </SkillsContainer>
    );
  }

  if (error) {
    return (
      <SkillsContainer id="skills">
        <ContentWrapper>
          <ErrorMessage>{error}</ErrorMessage>
        </ContentWrapper>
      </SkillsContainer>
    );
  }

  return (
    <SkillsContainer id="skills">
      <ContentWrapper>
        <HeaderSection>
          <SkillsTitle
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            My Skills
          </SkillsTitle>
          <SkillsSubtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Experienced in modern web technologies and frameworks, specializing in creating responsive and interactive applications with a focus on clean, efficient code.
          </SkillsSubtitle>
        </HeaderSection>

        <SkillsContent>
          <SkillsGrid>
            {skills.map((skill, index) => (
              <SkillItem
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SkillHeader>
                  <SkillName>{skill.name}</SkillName>
                  <SkillPercent>{skill.level}%</SkillPercent>
                </SkillHeader>
                <SkillBar>
                  <SkillProgress
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                  />
                </SkillBar>
              </SkillItem>
            ))}
            {skills.length === 0 && (
              <SkillItem>
                <SkillHeader>
                  <SkillName>No skills available</SkillName>
                </SkillHeader>
              </SkillItem>
            )}
          </SkillsGrid>

          <IconsGrid>
            {icons.map((icon, index) => (
              <IconBox
                key={icon.id}
                style={icon.pos}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {getIconComponent(icon.icon)}
              </IconBox>
            ))}
          </IconsGrid>
        </SkillsContent>
      </ContentWrapper>
    </SkillsContainer>
  );
};

export default Skills;