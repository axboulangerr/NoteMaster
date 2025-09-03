import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const AIAssistantContainer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e1e5e9;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: 768px) {
    width: 100vw;
    right: 0;
  }
`;

export const AIAssistantHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: 1px solid #e1e5e9;
`;

export const AIAssistantTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

export const AIAssistantCloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.2rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const AIAssistantBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const APIKeySection = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;

  h3 {
    margin: 0 0 0.5rem 0;
    color: #495057;
    font-size: 1.1rem;
  }

  p {
    margin: 0 0 1rem 0;
    color: #6c757d;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

export const APIKeyInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;

export const APIKeyButton = styled.button<{ variant?: 'remove' }>`
  background: ${props => props.variant === 'remove' ? '#dc3545' : '#667eea'};
  color: white;
  border: none;
  padding: ${props => props.variant === 'remove' ? '0.25rem 0.5rem' : '0.75rem 1rem'};
  border-radius: 4px;
  font-size: ${props => props.variant === 'remove' ? '0.8rem' : '0.9rem'};
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.variant === 'remove' ? '#c82333' : '#5a6fd8'};
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

export const APIKeyStatus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #d4edda;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #c3e6cb;
  color: #155724;
  font-size: 0.9rem;
  font-weight: 500;
`;

export const PromptSection = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

export const PromptTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  resize: vertical;
  box-sizing: border-box;
  margin-bottom: 0.75rem;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }

  &::placeholder {
    color: #6c757d;
  }

  &:disabled {
    background: #e9ecef;
    cursor: not-allowed;
  }
`;

export const PromptActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const PromptButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: #218838;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

export const QuickActionsSection = styled.div`
  h4 {
    margin: 0 0 0.75rem 0;
    color: #495057;
    font-size: 1rem;
  }

  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

export const QuickActionButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #5a6268;
  }

  &:disabled {
    background: #adb5bd;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const SelectedTextSection = styled.div`
  background: #e7f3ff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #b8d4ff;
`;

export const SelectedTextLabel = styled.div`
  font-weight: 600;
  color: #0056b3;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

export const SelectedTextContent = styled.div`
  background: white;
  padding: 0.75rem;
  border-radius: 4px;
  font-family: 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.4;
  color: #495057;
  border: 1px solid #ced4da;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 150px;
  overflow-y: auto;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  color: #6c757d;
  font-size: 0.9rem;

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e9ecef;
    border-top: 2px solid #667eea;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

export const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
  font-size: 0.9rem;
  line-height: 1.4;
`;

export const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #c3e6cb;
  font-size: 0.9rem;
  line-height: 1.4;
`;
