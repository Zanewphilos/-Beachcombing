import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styles from '../styles/Modal.module.css'; 


interface ModalProps {
  children: ReactNode;
  onClose: () => void; 
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {children}
        
      </div>
    </div>,
    document.body
  );
};

export default Modal;