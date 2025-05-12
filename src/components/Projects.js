import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaPhp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SiTailwindcss, SiMongodb, SiExpress, SiFirebase, SiMysql } from 'react-icons/si';
import { ref, onValue } from 'firebase/database';
import { getFirebaseDatabase } from '../firebase/config';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const ProjectsContainer = styled.div`
  padding: 6rem 2rem;
  background: linear-gradient(327deg, #9963fd 0%, #2e1065 100%);
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
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
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

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 0 1rem;
  max-width: 100%;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ProjectCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  height: 100%;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProjectImage = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const ProjectTitle = styled.h3`
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const ProjectDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  line-height: 1.6;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TechStack = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 0.5rem 0;
`;

const TechItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);

  svg {
    font-size: 1.1em;
  }
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const LinkButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.1em;
  }
`;



const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
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

const SkeletonCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 450px;
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 12px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.05) 8%, rgba(255, 255, 255, 0.1) 18%, rgba(255, 255, 255, 0.05) 33%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.2s linear infinite;
`;

const SkeletonText = styled.div`
  height: ${props => props.$height || "20px"};
  width: ${props => props.$width || "100%"};
  border-radius: 6px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.05) 8%, rgba(255, 255, 255, 0.1) 18%, rgba(255, 255, 255, 0.05) 33%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.2s linear infinite;
`;

const SkeletonTechStack = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const SkeletonTechItem = styled.div`
  height: 28px;
  width: 80px;
  border-radius: 20px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.05) 8%, rgba(255, 255, 255, 0.1) 18%, rgba(255, 255, 255, 0.05) 33%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.2s linear infinite;
`;

const SkeletonLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
`;

const SkeletonButton = styled.div`
  height: 36px;
  width: 100px;
  border-radius: 8px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.05) 8%, rgba(255, 255, 255, 0.1) 18%, rgba(255, 255, 255, 0.05) 33%);
  background-size: 800px 104px;
  animation: ${shimmer} 1.2s linear infinite;
`;

const ProjectsSkeleton = () => {
  return (
    <ProjectsGrid>
      {[1, 2, 3].map((index) => (
        <SkeletonCard key={index}>
          <SkeletonImage />
          <SkeletonText $height="28px" $width="70%" />
          <SkeletonText $height="60px" />
          <SkeletonTechStack>
            {[1, 2, 3].map((i) => (
              <SkeletonTechItem key={i} />
            ))}
          </SkeletonTechStack>
          <SkeletonLinks>
            <SkeletonButton />
            <SkeletonButton />
          </SkeletonLinks>
        </SkeletonCard>
      ))}
    </ProjectsGrid>
  );
};

// Map of technology names to their icons
const techStackIcons = {
  'React': <FaReact />,
  'Node.js': <FaNodeJs />,
  'MongoDB': <SiMongodb />,
  'Express': <SiExpress />,
  'Firebase': <SiFirebase />,
  'Tailwind': <SiTailwindcss />,
  'PHP': <FaPhp />,
  'MySQL': <SiMysql />,
  'HTML5': <FaHtml5 />,
  'CSS3': <FaCss3Alt />
};

const getTechIcon = (techName) => {
  return techStackIcons[techName] || null;
};

const PROJECTS_PER_PAGE = 6;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

 useEffect(() => {
  try {
    const db = getFirebaseDatabase();
    if (!db) {
      console.error('Firebase database not initialized');
      setError('Failed to initialize database connection');
      setLoading(false);
      return;
    }

    const projectsRef = ref(db, 'projects');

    const unsubscribe = onValue(
      projectsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert Firebase object to array, filter out unActive projects, and sort by views
          const projectsArray = Object.entries(data)
            .map(([id, project]) => ({
              id,
              ...project,
            }))
            .filter((project) => project.status !== 'unActive') // Filter out unActive projects
            .sort((a, b) => b.views - a.views);
          
          setProjects(projectsArray);
        } else {
          console.log('No projects data found');
          setProjects([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  } catch (error) {
    console.error('Error setting up Firebase:', error);
    setError('Failed to set up database connection');
    setLoading(false);
  }
}, []);

  // Calculate pagination values
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  if (loading) {
    return (
      <ProjectsContainer id="projects">
        <ContentWrapper>
          <HeaderSection>
            <Title
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Projects
            </Title>
            <Subtitle
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Showcasing my latest work and personal projects. Each project represents my passion for creating innovative solutions.
            </Subtitle>
          </HeaderSection>
          <ProjectsSkeleton />
        </ContentWrapper>
      </ProjectsContainer>
    );
  }

  if (error) {
    return (
      <ProjectsContainer id="projects">
        <ContentWrapper>
          <ErrorMessage>{error}</ErrorMessage>
        </ContentWrapper>
      </ProjectsContainer>
    );
  }

  return (
    <ProjectsContainer id="projects">
      <ContentWrapper>
        <HeaderSection>
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Projects
          </Title>
          <Subtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Showcasing my latest work and personal projects. Each project represents my passion for creating innovative solutions.
          </Subtitle>
        </HeaderSection>

        <ProjectsGrid
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentProjects.map((project) => (
            <ProjectCard
              key={project.id}
              variants={itemVariants}
            >
              <ProjectImage>
                <img src={project.image} alt={project.title} />
              </ProjectImage>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
              <TechStack>
                {project.techStack.map((tech, techIndex) => (
                  <TechItem key={techIndex}>
                    {getTechIcon(tech)}
                    {tech}
                  </TechItem>
                ))}
              </TechStack>
              <ProjectLinks>
                {project.github && (
                  <LinkButton href={project.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub /> GitHub
                  </LinkButton>
                )}
                {project.live && (
                  <LinkButton href={project.live} target="_blank" rel="noopener noreferrer">
                    <FaExternalLinkAlt /> Live Demo
                  </LinkButton>
                )}
              </ProjectLinks>
            </ProjectCard>
          ))}
          {currentProjects.length === 0 && (
            <NoProjectsMessage>
              <h2>No projects found</h2>
              <p>Check back later for new projects!</p>
            </NoProjectsMessage>
          )}
        </ProjectsGrid>

        {projects.length > PROJECTS_PER_PAGE && (
          <PaginationContainer>
            <PageButton 
              onClick={handlePreviousPage} 
              disabled={currentPage === 1}
            >
              <FaChevronLeft /> Previous
            </PageButton>
            <PageInfo>
              Page {currentPage} of {totalPages}
            </PageInfo>
            <PageButton 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
            >
              Next <FaChevronRight />
            </PageButton>
          </PaginationContainer>
        )}
      </ContentWrapper>
    </ProjectsContainer>
  );
};

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
  padding: 0 1rem;
`;

const PageButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  svg {
    font-size: 0.8em;
  }
`;

const PageInfo = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  min-width: 100px;
  text-align: center;
`;

const NoProjectsMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

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

export default Projects; 