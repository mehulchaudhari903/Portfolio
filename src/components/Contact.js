import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getFirebaseDatabase } from '../firebase/config'; // Updated import
import { ref, push } from 'firebase/database';

const ContactContainer = styled.div`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #f8f7ff 0%, #f1f1f1 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 6rem 1rem;
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

  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  color: #37306b;
  margin-bottom: 1rem;
  font-weight: 600;

  @media (max-width: 400px) {
    font-size: clamp(2rem, 4vw, 2.5rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.1rem);
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 400px) {
    font-size: clamp(0.9rem, 1.8vw, 1rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
  margin-top: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled.div`
  background: #fff;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const InfoTitle = styled.h3`
  font-size: 1.5rem;
  color: #471d95;
  margin-bottom: 1.5rem;
`;

const ContactDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(55, 48, 107, 0.03);
  border-radius: 8px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(5px);
  }

  svg {
    font-size: 1.2rem;
    color: #471d95;
  }
`;

const ItemText = styled.div`
  h4 {
    font-size: 1rem;
    color: #471d95;
    margin-bottom: 0.2rem;
  }

  p {
    font-size: 0.9rem;
    color: #666;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SocialLink = styled.a`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #471d95;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background: #793aed;
  }
`;

const ContactForm = styled(motion.form)`
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #471d95;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #471d95;
    box-shadow: 0 0 0 2px rgba(55, 48, 107, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #37306b;
    box-shadow: 0 0 0 2px rgba(55, 48, 107, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  background: #471d95;
  color: #fff;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s ease;

  &:hover {
    background: #793aed;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: 0.3rem;
  display: block;
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
    createdAt: new Date().toISOString(),
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        const database = getFirebaseDatabase();
        const messagesRef = ref(database, 'contact');

        await push(messagesRef, {
          ...formData,
          createdAt: new Date().toISOString(),
        });

        toast.success('Message sent successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });

        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: '',
          createdAt: new Date().toISOString(),
        });
        setErrors({});
      } catch (error) {
        console.error('Error sending message to Firebase:', error);
        toast.error('Failed to send message. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSocialClick = (platform) => {
    toast.info(`Redirecting to ${platform}...`, {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  return (
    <ContactContainer id="contact">
      <ContentWrapper>
        <HeaderSection>
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Get In Touch
          </Title>
          <Subtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Have a project in mind? Let's discuss how we can work together to bring your ideas to life.
          </Subtitle>
        </HeaderSection>

        <ContactGrid>
          <ContactInfo>
            <InfoTitle>Contact Information</InfoTitle>
            <ContactDetails>
              <ContactItem>
                <FaPhone />
                <ItemText>
                  <h4>Phone</h4>
                  <p>+91 8758385412</p>
                </ItemText>
              </ContactItem>
              <ContactItem>
                <FaEnvelope />
                <ItemText>
                  <h4>Email</h4>
                  <p>mehulchaudhari5215@gmail.com</p>
                </ItemText>
              </ContactItem>
              <ContactItem>
                <FaMapMarkerAlt />
                <ItemText>
                  <h4>Location</h4>
                  <p>Valsad, Gujarat</p>
                </ItemText>
              </ContactItem>
            </ContactDetails>

            <SocialLinks>
              <SocialLink
                href="https://www.linkedin.com/authwall?trk=bf&trkInfo=AQHL7Uaucb2SAgAAAZbD8dEYr7qjvhiCciYZt_6QG0pBsZuXXf1VmL5ACxtkOxBEbA1p2_Lm9bR1iRiCU0IaDkT8zV3isvKqKp6v0qvsSCsEEG7F1FR--DqdhkJU1dc98ImO9JU=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fmehul-chaudhari-819674267%3Futm_source%3Dshare%26utm_campaign%3Dshare_via%26utm_content%3Dprofile%26utm_medium%3Dandroid_app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('LinkedIn')}
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin />
              </SocialLink>
              <SocialLink
                href="https://github.com/mehulchaudhari903"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('GitHub')}
                aria-label="GitHub Profile"
              >
                <FaGithub />
              </SocialLink>
             
            </SocialLinks>
          </ContactInfo>

          <ContactForm
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FormGroup>
              <InputGroup>
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    aria-invalid={errors.firstName ? 'true' : 'false'}
                    aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  />
                  {errors.firstName && (
                    <ErrorMessage id="firstName-error">{errors.firstName}</ErrorMessage>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    aria-invalid={errors.lastName ? 'true' : 'false'}
                    aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  />
                  {errors.lastName && (
                    <ErrorMessage id="lastName-error">{errors.lastName}</ErrorMessage>
                  )}
                </div>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && <ErrorMessage id="email-error">{errors.email}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Project Discussion"
                aria-invalid={errors.subject ? 'true' : 'false'}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
              />
              {errors.subject && (
                <ErrorMessage id="subject-error">{errors.subject}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="message">Message</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message here..."
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && (
                <ErrorMessage id="message-error">{errors.message}</ErrorMessage>
              )}
            </FormGroup>

            <SubmitButton
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </SubmitButton>
          </ContactForm>
        </ContactGrid>
      </ContentWrapper>
    </ContactContainer>
  );
};

export default Contact;