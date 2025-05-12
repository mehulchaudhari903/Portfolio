import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';

const Nav = styled.nav`
  background: ${({ $isOpen, $scrolled, $isDarkPage }) => 
    $isOpen 
      ? $isDarkPage ? 'rgba(46, 16, 101, 0.95)' : '#fff'
      : $scrolled 
        ? $isDarkPage ? 'rgba(46, 16, 101, 0.8)' : 'rgba(255, 255, 255, 0.8)'
        : 'rgba(255, 255, 255, 0)'
  };
  backdrop-filter: ${({ $isOpen, $scrolled }) => 
    $isOpen 
      ? 'blur(10px)'
      : $scrolled 
        ? 'blur(10px)'
        : 'none'
  };
  -webkit-backdrop-filter: ${({ $isOpen, $scrolled }) => 
    $isOpen 
      ? 'blur(10px)'
      : $scrolled 
        ? 'blur(10px)'
        : 'none'
  };
  height: 80px;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem calc((100vw - 1200px) / 2);
  z-index: 10;
  position: fixed;
  width: 100%;
  box-shadow: ${({ $scrolled, $isDarkPage, $isOpen }) => 
    $isOpen
      ? $isDarkPage ? '0 2px 10px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.1)'
      : $scrolled 
        ? $isDarkPage ? '0 2px 10px rgba(0, 0, 0, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.1)'
        : 'none'
  };
  transition: all 0.3s ease;
`;

const Logo = styled(Link)`
  color: ${({ $isDarkPage }) => $isDarkPage ? '#ffffff' : '#b28bfa'};
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  transition: color 0.3s ease;
`;

const StyledNavLink = styled(NavLink)`
  color: ${({ $isDarkPage }) => $isDarkPage ? '#ffffff' : '#333'};
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1.5rem;
  height: 100%;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  opacity: ${({ $isDarkPage }) => $isDarkPage ? '0.9' : '1'};

  &:hover {
    color: ${({ $isDarkPage }) => $isDarkPage ? '#ffffff' : '#b28bfa'};
    opacity: 1;
  }

  &.active {
    color: ${({ $isDarkPage }) => $isDarkPage ? '#b28bfa' : '#b28bfa'};
    opacity: 1;
    position: relative;
    font-weight: 600;
  }
`;

const Bars = styled(FaBars)`
  display: none;
  color: ${({ $isDarkPage }) => $isDarkPage ? '#ffffff' : '#333'};

  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NavBtn = styled.div`
  display: flex;
  align-items: center;
  margin-right: 24px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const ContactButton = styled(Link)`
  background: ${({ $isDarkPage }) => $isDarkPage ? '#ffffff' : '#925cf6'};
  color: ${({ $isDarkPage }) => $isDarkPage ? '#471d95' : '#ffffff'};
  padding: 10px 22px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    background: ${({ $isDarkPage }) => $isDarkPage ? '#f0f0f0' : '#793aed'};
    transform: translateY(-2px);
  }
`;

const MobileMenu = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: fixed;
    top: 80px;
    left: 0;
    width: 100%;
    background: ${({ $isDarkPage }) => $isDarkPage ? 'rgba(46, 16, 101, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 9;
    border-top: ${({ $isDarkPage }) => $isDarkPage ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)'};
    max-height: 85vh;
    overflow-y: auto;
  }
`;

const StyledMobileNavLink = styled(StyledNavLink)`
  padding: 1rem;
  width: 100%;
  text-align: center;
  border-bottom: ${({ $isDarkPage }) => $isDarkPage ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #eee'};

  &.active {
    &::after {
      display: none;
    }
    background: ${({ $isDarkPage }) => $isDarkPage ? 'rgba(255, 255, 255, 0.1)' : 'rgba(178, 139, 250, 0.1)'};
  }
`;

const MobileContactButton = styled(ContactButton)`
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Check if current page has a dark background
  const isDarkPage = 
    location.pathname === '/skills' || 
    location.pathname === '/education' || 
    location.pathname === '/projects' ||
    location.pathname === '/resume' ||
    location.pathname === '*'; // 404 page

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggle = () => setIsOpen(!isOpen);

  const navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/about', label: 'About' },
    { path: '/skills', label: 'Skills' },
    { path: '/education', label: 'Education' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <>
      <Nav $isOpen={isOpen} $scrolled={scrolled} $isDarkPage={isDarkPage}>
        <Logo to="/" $isDarkPage={isDarkPage}>Portfolio</Logo>
        <Bars onClick={toggle} $isDarkPage={isDarkPage} />
        <NavMenu>
          {navLinks.map((link) => (
            <StyledNavLink 
              key={link.path} 
              to={link.path} 
              end={link.exact}
              $isDarkPage={isDarkPage}
            >
              {link.label}
            </StyledNavLink>
          ))}
        </NavMenu>
        <NavBtn>
          <ContactButton to="/resume" $isDarkPage={isDarkPage}>Resume CV</ContactButton>
        </NavBtn>
      </Nav>
      <MobileMenu $isOpen={isOpen} $isDarkPage={isDarkPage}>
        {navLinks.map((link) => (
          <StyledMobileNavLink 
            key={link.path} 
            to={link.path} 
            end={link.exact}
            $isDarkPage={isDarkPage}
          >
            {link.label}
          </StyledMobileNavLink>
        ))}
        <MobileContactButton to="/resume" $isDarkPage={isDarkPage}>Resume CV</MobileContactButton>
      </MobileMenu>
    </>
  );
};

export default Navbar; 