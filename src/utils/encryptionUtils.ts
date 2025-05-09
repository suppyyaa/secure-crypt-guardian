
import CryptoJS from "crypto-js";

// Constants for encryption
const ITERATION_COUNT = 100000;  // PBKDF2 iterations
const KEY_SIZE = 256 / 32;       // 256 bits
const SALT_SIZE = 128 / 8;       // 128 bits
const IV_SIZE = 128 / 8;         // 128 bits for AES

export interface EncryptionOptions {
  iterations?: number;
  keySize?: number;
}

// Create a random salt for key derivation
export const generateSalt = (): string => {
  return CryptoJS.lib.WordArray.random(SALT_SIZE).toString();
};

// Create a random initialization vector
export const generateIV = (): string => {
  return CryptoJS.lib.WordArray.random(IV_SIZE).toString();
};

// Derive key using PBKDF2
export const deriveKey = (
  password: string, 
  salt: string, 
  options: EncryptionOptions = {}
): CryptoJS.lib.WordArray => {
  const iterations = options.iterations || ITERATION_COUNT;
  const keySize = options.keySize || KEY_SIZE;
  
  return CryptoJS.PBKDF2(password, salt, {
    keySize,
    iterations,
  });
};

// Encrypt text
export const encryptText = (
  text: string, 
  password: string,
  options: EncryptionOptions = {}
): string => {
  try {
    if (!text || !password) {
      throw new Error("Text and password are required");
    }
    
    const salt = generateSalt();
    const iv = generateIV();
    const key = deriveKey(password, salt, options);
    
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
    });
    
    // Format: iterations:keySize:salt:iv:ciphertext
    const iterations = options.iterations || ITERATION_COUNT;
    const keySize = options.keySize || KEY_SIZE;
    
    return [
      iterations,
      keySize,
      salt,
      iv,
      encrypted.toString(),
    ].join(":");
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt text: " + (error as Error).message);
  }
};

// Decrypt text
export const decryptText = (
  encryptedData: string,
  password: string
): string => {
  try {
    if (!encryptedData || !password) {
      throw new Error("Encrypted data and password are required");
    }
    
    // Format: iterations:keySize:salt:iv:ciphertext
    const parts = encryptedData.split(":");
    
    if (parts.length !== 5) {
      throw new Error("Invalid encrypted data format");
    }
    
    const [iterationsStr, keySizeStr, salt, iv, ciphertext] = parts;
    const iterations = parseInt(iterationsStr, 10);
    const keySize = parseInt(keySizeStr, 10);
    
    if (isNaN(iterations) || isNaN(keySize)) {
      throw new Error("Invalid encryption parameters");
    }
    
    const key = deriveKey(password, salt, { iterations, keySize });
    
    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
    });
    
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!result) {
      throw new Error("Incorrect password or corrupted data");
    }
    
    return result;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data: " + (error as Error).message);
  }
};

// Calculate password strength (0-100)
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let score = 0;
  
  // Length check (up to 40%)
  const lengthScore = Math.min(password.length * 4, 40);
  score += lengthScore;
  
  // Complexity checks (up to 60%)
  if (/[A-Z]/.test(password)) score += 10; // uppercase
  if (/[a-z]/.test(password)) score += 10; // lowercase
  if (/[0-9]/.test(password)) score += 10; // numbers
  if (/[^A-Za-z0-9]/.test(password)) score += 15; // special chars
  
  // Check for variety (not just repeated characters)
  const uniqueChars = new Set(password.split("")).size;
  const varietyScore = Math.min(uniqueChars * 2, 15);
  score += varietyScore;
  
  return Math.min(score, 100);
};

// File encryption helpers
export const encryptFile = async (
  file: File,
  password: string,
  options: EncryptionOptions = {}
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file");
        }
        
        const fileData = event.target.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(fileData);
        const fileContent = wordArray.toString(CryptoJS.enc.Base64);
        
        // Add file metadata
        const metadata = {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified
        };
        
        const dataToEncrypt = JSON.stringify({
          metadata,
          content: fileContent
        });
        
        // Encrypt the data
        const encryptedData = encryptText(dataToEncrypt, password, options);
        
        // Create a blob from the encrypted data
        const blob = new Blob([encryptedData], { type: "application/octet-stream" });
        resolve(blob);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const decryptFile = async (
  encryptedBlob: Blob,
  password: string
): Promise<{ data: Blob; metadata: any }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read encrypted file");
        }
        
        const encryptedData = event.target.result as string;
        const decryptedData = decryptText(encryptedData, password);
        
        const { metadata, content } = JSON.parse(decryptedData);
        
        // Convert Base64 content back to Blob
        const binaryData = atob(content);
        const bytes = new Uint8Array(binaryData.length);
        
        for (let i = 0; i < binaryData.length; i++) {
          bytes[i] = binaryData.charCodeAt(i);
        }
        
        const blob = new Blob([bytes.buffer], { type: metadata.type || "application/octet-stream" });
        
        resolve({
          data: blob,
          metadata
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading encrypted file"));
    };
    
    reader.readAsText(encryptedBlob);
  });
};
