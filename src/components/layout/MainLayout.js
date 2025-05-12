import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled(motion.main)`
  flex: 1;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const pageTransition = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  }
};

const MainLayout = () => {
  return (
    <LayoutContainer>
      <Navbar />
      <MainContent
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        <Outlet />
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default MainLayout; 