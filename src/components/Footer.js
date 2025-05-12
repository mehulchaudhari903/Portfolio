import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaArrowUp, FaGithub, FaLink } from 'react-icons/fa';
import { toast } from 'react-toastify';

const FooterContainer = styled.footer`
  background-color: #471d95;
  color: #fff;
  padding: 80px 30px 20px 30px;
  position: relative;

  @media screen and (max-width: 768px) {
    padding: 60px 15px 20px 15px;
  }
`;

const FooterWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  
  @media screen and (max-width: 768px) {
    align-items: center;
  }
`;

const Logo = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #fff;
  // Add specific logo styling if needed
`;

const FooterText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  max-width: 300px;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.8);
`;

const FooterTitle = styled.h4`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 25px;
  color: #fff;
`;

const ContactList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ContactItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);

  svg {
    margin-right: 10px;
    color: #fff;
    font-size: 16px;
    min-width: 20px; // Ensure alignment
  }
`;


const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialIconLink = styled.a`
  color: #37306B;
  background-color: #fff;
  width: 35px;
  height: 35px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background-color: #eee;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #2e1065;
  padding-top: 20px;
  margin-top: 40px;
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);

  a {
    color: #fff;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #b28bfa;
  color: #fff;
  border: none;
  border-radius: 5px;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${({ $isVisible }) => ($isVisible ? '1' : '0')};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const ExternalLink = styled.a`
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: color 0.3s ease;

  &:hover {
    color: #b28bfa;
  }

  svg {
    font-size: 16px;
  }
`;

const socialLinks = [
  { icon: FaLinkedinIn, href: 'https://www.linkedin.com/authwall?trk=bf&trkInfo=AQHL7Uaucb2SAgAAAZbD8dEYr7qjvhiCciYZt_6QG0pBsZuXXf1VmL5ACxtkOxBEbA1p2_Lm9bR1iRiCU0IaDkT8zV3isvKqKp6v0qvsSCsEEG7F1FR--DqdhkJU1dc98ImO9JU=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fmehul-chaudhari-819674267%3Futm_source%3Dshare%26utm_campaign%3Dshare_via%26utm_content%3Dprofile%26utm_medium%3Dandroid_app', label: 'LinkedinIn' },
  { icon: FaGithub, href: 'https://github.com/mehulchaudhari903', label: 'Github' },
  // { icon: FaLink, href: '#', label: 'Naukri' }
];

const contactInfo = [
  { icon: FaPhone, text: '+91 8758385412' },
  { icon: FaEnvelope, text: 'mehulchaudhari5215@gmail.com' },
  { icon: FaMapMarkerAlt, text: 'Valsad, Gujarat ' }
];

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const currentYear = new Date().getFullYear();

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    toast.success('Scrolled to top!', {
      position: "top-right",
      autoClose: 2000,
    });
  };


  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <FooterContainer>
      <FooterWrapper>
        <FooterColumn>
          <Logo>Portfolio
          </Logo>
          <FooterText>
            I've been working as web developer for the past two years, and have experience
          </FooterText>
        </FooterColumn>

        <FooterColumn>
          <FooterTitle>Contact Details</FooterTitle>
          <ContactList>
            {contactInfo.map((item, index) => (
              <ContactItem key={index}>
                <item.icon /> {item.text}
              </ContactItem>
            ))}
          </ContactList>
        </FooterColumn>

        <FooterColumn>
          <FooterTitle>Link</FooterTitle>
        
          <SocialIcons>
            {socialLinks.map((social, index) => (
              <SocialIconLink 
                key={index}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon />
              </SocialIconLink>
            ))}
          </SocialIcons>
        </FooterColumn>
      </FooterWrapper>
      <FooterBottom>
        Copyright © {currentYear} {' '}
        <ExternalLink 
          href="https://github.com/mehulchaudhari903" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FaGithub />
          mehulchaudhari903
        </ExternalLink>
        . All Rights Reserved.
      </FooterBottom>
      <ScrollToTopButton onClick={scrollToTop} $isVisible={isVisible}>
        <FaArrowUp />
      </ScrollToTopButton>
    </FooterContainer>
  );
};

export default Footer; 