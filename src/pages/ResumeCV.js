import { useState } from 'react';
import styled from 'styled-components'; // Add styled-components import
import { FaDownload } from 'react-icons/fa'; // Add react-icons import
import './ResumeCV.css';

const DownloadButton = styled.button`
  background-color: #471d95;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin: 20px auto;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #793aed;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 18px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
`;

const ResumeCV = () => {
    const [scale, setScale] = useState(1.0);

    // Add handleDownload function
    const handleDownload = () => {
        // Create a link element to trigger download
        const link = document.createElement('a');
        link.href = '/assets/resume.jpg'; // Path to your resume file
        link.download = 'resume.jpg'; // Name for downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="resume-container">
            <div className="resume-viewer">
                <div 
                    className="resume-content"
                    style={{
                        transform: `scale(${scale})`
                    }}
                >
                    <img 
                        src="/assets/resume.jpg" 
                        alt="Resume"
                        className="resume-image"
                    />
                </div>
            </div>
            <ButtonContainer>
                <DownloadButton onClick={handleDownload}>
                    <FaDownload /> Download Resume
                </DownloadButton>
            </ButtonContainer>
        </div>
    );
};

export default ResumeCV;