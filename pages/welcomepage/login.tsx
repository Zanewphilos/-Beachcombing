import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import styles from '../../styles/FormModal.module.css'; 

interface Props {
  handleClose: () => void;
  handleModeChange: (mode: 'login' | 'register') => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC<Props> = ({ handleClose ,handleModeChange }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const auth = useAuth();
  const router = useRouter();

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await auth?.login(data.email, data.password);
      //login
      handleClose();
      router.push('/profile');
    } catch (error) {
      console.error("Login failed:", error);
     
    }
  };

  return (
    <div className={styles.modalForm}>
      <h2>Login Page</h2> 
      <form onSubmit={handleSubmit(onLoginSubmit)} className={styles.form}>
      {/* Form fields */}
      <div className={styles.formGroup}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <span className={styles.error}>{errors.password.message}</span>}
      </div>
      <button type="submit" className={styles.submitButton}>Login</button>
      <button onClick={() => handleModeChange('register')}>Switch to Register</button>
      {/* Submit button */}
      
    </form>
    </div>
  );
};

export default LoginPage;