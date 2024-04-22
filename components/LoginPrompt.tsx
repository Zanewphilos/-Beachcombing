import React, { CSSProperties, useEffect,useState } from 'react';
import Modal from '@mui/material/Modal';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/welcomepage/login';
import RegisterPage from '../pages/welcomepage/register';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';

const LoginPrompt: React.FC = () => {
  const auth = useAuth();
  console.log("Auth in LoginPrompt:", auth);

  const router = useRouter(); 

  

  // 状态来控制模态框是否显示
  const [open, setOpen] = useState(false);
  
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // 如果用户已登录，则不显示任何内容
  //if (auth?.user) return null;

  useEffect(() => {
    // 如果用户未登录，则打开登录模态框
    if (!auth?.user) {
      setOpen(true);
    }
  }, [auth?.user]); 

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
  };

  const handleClose = () => {
    console.log("Closing LoginPrompt");
    setOpen(false);
    
  };
  
  const handleSkip = () => {
    console.log('Skipping login prompt');
    setOpen(false);
    
    router.push('/');
  };
  
  
  const handleCloseAndRedirect = () => {
    handleClose();
    if (auth?.user) {
      router.push('/profile');
    }
  };
  
  const backgroundStyle: CSSProperties = {
    
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'white', 
    padding: '20px', 
    borderRadius: '4px', 
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end', // 以屏幕底部为参照系放置按钮
    paddingBottom: '60%', // 将按钮放在屏幕的4分之一处
    backdropFilter: 'blur(100px) brightness(0.75)', // 背景模糊和透明度调整 // 为元素间添加间距
    backgroundImage: 'url(/images/loginprompt/ghost_crab.jpg)', // 背景图片
    backgroundPosition: 'center', // 背景图片居中
    backgroundSize: 'cover', // 背景图片完全包含在容器中
    backgroundRepeat: 'no-repeat', // 背景图片不重复 // 背景图片覆盖
    color: 'black', // 文本颜色
    
  };

  const formContainerStyle: CSSProperties = {
    width: '90%',
    maxWidth: '400px',
    background: 'rgba(255, 255, 255, 0.85)', 
    borderRadius: '4px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
  };


  return  (
    <>
      {/* Move the buttons outside of the Modal to ensure they are clickable when the modal is not open */}
      
        <div style={formContainerStyle}>
          <Button variant="contained" color="primary" onClick={() => handleModeChange('register')}>
            Register
          </Button>
          <hr style={{ width: '100%' }} />
          <p>Already have an account? <Button variant="text" onClick={() => handleModeChange('login')}>Log in</Button></p>
        </div>
      
 
      
        <div style={backgroundStyle}>
          {/* Conditional rendering for LoginPage or RegisterPage based on the mode */}
          {mode === 'login' && <LoginPage handleClose={handleCloseAndRedirect} handleModeChange={handleModeChange}  />}
          {mode === 'register' && <RegisterPage handleClose={handleCloseAndRedirect} handleModeChange={handleModeChange} />}
          
          
          <Button
            variant="contained"
            color="inherit"
            onClick={handleSkip} 
            sx={{ position: 'absolute', top: 10, right: 10 }}
          >
            Skip
          </Button>
        </div>
      
    </>
  );
};

export default LoginPrompt;