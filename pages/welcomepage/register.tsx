import React, { useState } from 'react'; 
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import styles from '../../styles/FormModal.module.css';

interface Props {
  handleClose: () => void;
  handleModeChange: (mode: 'login' | 'register') => void;
}

interface IFormInput {
  username:string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC<Props> = ({ handleClose ,handleModeChange}) => {
  const [apiError, setApiError] = useState(''); 
  const auth = useAuth();
  const { register: formRegister, handleSubmit, watch, formState: { errors } } = useForm<IFormInput>();
  const password = watch("password");
  const router = useRouter();

  const onRegisterSubmit = async (data: IFormInput) => {
    if (Object.keys(errors).length > 0) {
      
      const errorMessages = Object.values(errors).map(error => error.message).join('\n');
      alert(`Please correct the following errors:\n${errorMessages}`);
      return;
    }
    const defaultAvatarUrl = "https://beachcombingstorage.blob.core.windows.net/useravatar/defaultavatar.jpg";
    const defaultSelfIntro = "beach explorer";

    try {
      const result = await auth?.register(data.username, data.email, data.password, defaultAvatarUrl, defaultSelfIntro);
        if (result) {
            handleClose(); 
            router.push('/profile'); 
        } else {
            
            setApiError('Registration did not return any result.'); 
        }
    } catch (error: any) {
        setApiError(error.message); 
    }
  };



  return (
    <div className={styles.modalForm}>
      <h2>Register Page</h2>
      <form onSubmit={handleSubmit(onRegisterSubmit)}>
      <input {...formRegister('username', { required: 'Username is required' })} placeholder="Username" />
        
        
      <input {...formRegister('email', { required: 'Email is required' })} placeholder="Email" />
        {/* {errors.email?.message && <p className={styles.errorMessage}>{errors.email?.message.toString()}</p>} */}

        <input {...formRegister('password', { required: 'Password is required' })} type="password" placeholder="Password" />
        {/* {errors.password && <p className={styles.errorMessage}>{errors.password?.message?.toString() ?? ''}</p>} */}

        <input {...formRegister('confirmPassword', {
        required: 'Confirm Password is required',
        validate: value => value === password || "The passwords do not match"
        })} type="password" placeholder="Confirm Password" />
        {/* {errors.confirmPassword && <p className={styles.errorMessage}>{String(errors.confirmPassword?.message)}</p>} */}

        <button type="submit" className={styles.submitButton}>Register</button>
        <button onClick={() => handleModeChange('login')}>Switch to Login</button>
        <button onClick={handleClose}>Close</button>

      </form>
      <p className={styles.passwordHint}>
        The password should contain upper and lower case characters and a punctuation mark, example: Password123!
      </p>
    </div>
  );
};

export default RegisterPage;