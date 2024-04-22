import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginPrompt from '../components/LoginPrompt';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import styles from '../styles/UserPage.module.css';
import SettingsFlyout from '../components/SettingsFlyout';
import { instructionService } from '../services/apiService_Instruction'; 
import { InstructionData } from '../types/InstructionTypes'; 

const UserPage: React.FC = () => {
  const auth = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [instruction, setInstruction] = useState<InstructionData | null>(null);

  useEffect(() => {
    if (!auth?.user) {
      
      setShowLoginPrompt(true);
    } else {
   
      setShowLoginPrompt(false);
      instructionService.getInstructions()
        .then((data) => {
          console.log(data);
          setInstruction(data);
        })
        .catch((error) => {
          console.error("Failed to fetch instructions:", error);
        });
    }
    
  }, [auth?.user]);
  if (!auth) {

    return <div>Loading...</div>;
  }
  
  if (!auth.user) {
    return <LoginPrompt />;
  }

  const { user } = auth;
 
  return (
    <Box className={styles.userContainer}>
      
      <div className={styles.settingsFlyoutContainer}>
        <SettingsFlyout />
      </div>
      <div className={styles.avatarWrapper}>
        <Avatar
          className={styles.avatar}
          src={user.avatarUrl || ''}
          alt={user.userName || 'User'}
        />
      </div>


      <div className={styles.personalInfo}>
        <Typography variant="h5" className={styles.userName}>
          {user.userName}
        </Typography>
        <Typography variant="body1" className={styles.infoText}>
          Email: {user.email}
        </Typography>
        <Typography variant="body1" className={styles.infoText}>
          Self Intro: {user.selfIntro}
        </Typography>
      </div>

  
      <Paper elevation={3} className={styles.instructionsContainer}>
  {instruction ? (
    <>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontSize: '1.5rem', // Adjust the font size as needed
            textAlign: 'center', // Center the text
          }}
        >
          Clean Up Instruction
        </Typography>
        <div>
          <Typography variant="h6" gutterBottom>
            {instruction.title1}
          </Typography>
          <Button href={instruction.url1} target="_blank">
            Read More
          </Button>
        </div>
        <div>
          <Typography variant="h6" gutterBottom>
            {instruction.title2}
          </Typography>
          <Button href={instruction.url2} target="_blank">
            Read More
          </Button>
        </div>
      </>
    ) : (
      <Typography>Loading Instructions...</Typography>
    )}
  </Paper>
    </Box>
  );
};

export default UserPage;