
import { useState } from 'react';
import { 
  encryptText, 
  decryptText, 
  encryptFile,
  decryptFile,
  EncryptionOptions
} from '../utils/encryptionUtils';

export type OperationType = 'encrypt' | 'decrypt' | 'none';

export interface EncryptionState {
  inputText: string;
  outputText: string;
  password: string;
  operationType: OperationType;
  file: File | null;
  outputFile: { blob: Blob; name: string } | null;
  isProcessing: boolean;
  error: string | null;
  isTextMode: boolean;
  advancedOptions: EncryptionOptions;
}

export const useEncryption = () => {
  const [state, setState] = useState<EncryptionState>({
    inputText: '',
    outputText: '',
    password: '',
    operationType: 'none',
    file: null,
    outputFile: null,
    isProcessing: false,
    error: null,
    isTextMode: true,
    advancedOptions: {
      iterations: 100000,
      keySize: 256/32
    }
  });

  // Update input text
  const setInputText = (text: string) => {
    setState(prev => ({ ...prev, inputText: text }));
  };

  // Update password
  const setPassword = (password: string) => {
    setState(prev => ({ ...prev, password, error: null }));
  };

  // Handle file selection
  const setFile = (file: File | null) => {
    setState(prev => ({ ...prev, file, error: null }));
  };

  // Switch between text and file mode
  const setTextMode = (isTextMode: boolean) => {
    setState(prev => ({ 
      ...prev, 
      isTextMode,
      error: null,
      outputText: '',
      outputFile: null
    }));
  };
  
  // Update advanced options
  const setAdvancedOptions = (options: EncryptionOptions) => {
    setState(prev => ({
      ...prev,
      advancedOptions: { ...prev.advancedOptions, ...options }
    }));
  };

  // Handle encryption
  const encrypt = async () => {
    setState(prev => ({ ...prev, isProcessing: true, error: null, outputText: '', outputFile: null }));
    
    try {
      if (state.isTextMode) {
        // Text encryption
        if (!state.inputText) {
          throw new Error("Please enter text to encrypt");
        }
        if (!state.password) {
          throw new Error("Please enter a password");
        }
        
        const encryptedText = encryptText(state.inputText, state.password, state.advancedOptions);
        setState(prev => ({ 
          ...prev, 
          isProcessing: false, 
          outputText: encryptedText,
          operationType: 'encrypt'
        }));
      } else {
        // File encryption
        if (!state.file) {
          throw new Error("Please select a file to encrypt");
        }
        if (!state.password) {
          throw new Error("Please enter a password");
        }
        
        const encryptedBlob = await encryptFile(state.file, state.password, state.advancedOptions);
        const fileName = `${state.file.name}.encrypted`;
        
        setState(prev => ({ 
          ...prev, 
          isProcessing: false, 
          outputFile: { blob: encryptedBlob, name: fileName },
          operationType: 'encrypt'
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: (error as Error).message 
      }));
    }
  };

  // Handle decryption
  const decrypt = async () => {
    setState(prev => ({ ...prev, isProcessing: true, error: null, outputText: '', outputFile: null }));
    
    try {
      if (state.isTextMode) {
        // Text decryption
        if (!state.inputText) {
          throw new Error("Please enter encrypted text to decrypt");
        }
        if (!state.password) {
          throw new Error("Please enter the decryption password");
        }
        
        const decryptedText = decryptText(state.inputText, state.password);
        setState(prev => ({ 
          ...prev, 
          isProcessing: false, 
          outputText: decryptedText,
          operationType: 'decrypt'
        }));
      } else {
        // File decryption
        if (!state.file) {
          throw new Error("Please select an encrypted file to decrypt");
        }
        if (!state.password) {
          throw new Error("Please enter the decryption password");
        }
        
        const { data, metadata } = await decryptFile(state.file, state.password);
        const fileName = metadata.name || "decrypted_file";
        
        setState(prev => ({ 
          ...prev, 
          isProcessing: false, 
          outputFile: { blob: data, name: fileName },
          operationType: 'decrypt'
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: (error as Error).message 
      }));
    }
  };

  // Reset state
  const reset = () => {
    setState({
      inputText: '',
      outputText: '',
      password: '',
      operationType: 'none',
      file: null,
      outputFile: null,
      isProcessing: false,
      error: null,
      isTextMode: true,
      advancedOptions: {
        iterations: 100000,
        keySize: 256/32
      }
    });
  };

  return {
    state,
    setInputText,
    setPassword,
    setFile,
    setTextMode,
    setAdvancedOptions,
    encrypt,
    decrypt,
    reset
  };
};
