import styled from 'styled-components';

export const EditorContainer = styled.div<{ layout: 'split' | 'editor' | 'preview' }>`
  display: flex;
  height: calc(100vh - 200px);
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
  
  ${props => props.layout === 'editor' && `
    .preview-pane { display: none; }
    .editor-pane { flex: 1; }
  `}
  
  ${props => props.layout === 'preview' && `
    .editor-pane { display: none; }
    .preview-pane { flex: 1; border-left: none; }
  `}
`;

export const EditorPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  
  &.editor-pane {
    min-width: 300px;
  }
`;

export const PreviewPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e1e5e9;
  
  &.preview-pane {
    min-width: 300px;
  }
`;

export const PaneHeader = styled.div`
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e1e5e9;
  font-weight: 600;
  color: #555;
`;

export const Textarea = styled.textarea<{ theme: 'light' | 'dark'; fontSize: number }>`
  flex: 1;
  border: none;
  padding: 1rem;
  font-family: 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: ${props => props.fontSize}px;
  line-height: 1.6;
  resize: none;
  outline: none;
  background: ${props => props.theme === 'dark' ? '#2d3748' : '#fafafa'};
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  tab-size: 2;
  
  &::selection {
    background: ${props => props.theme === 'dark' ? '#4a5568' : '#bee3f8'};
  }
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme === 'dark' ? '#1a202c' : '#f7fafc'};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'dark' ? '#4a5568' : '#cbd5e0'};
    border-radius: 4px;
  }
`;

export const PreviewContent = styled.div<{ theme: 'light' | 'dark'; fontSize: number }>`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: ${props => props.theme === 'dark' ? '#1a202c' : 'white'};
  color: ${props => props.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
  font-size: ${props => props.fontSize}px;
  line-height: 1.7;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    color: ${props => props.theme === 'dark' ? '#f7fafc' : '#333'};
    line-height: 1.2;
  }
  
  h1 { 
    font-size: 2.5rem; 
    border-bottom: 2px solid ${props => props.theme === 'dark' ? '#4a5568' : '#e2e8f0'};
    padding-bottom: 0.5rem;
  }
  h2 { 
    font-size: 2rem; 
    border-bottom: 1px solid ${props => props.theme === 'dark' ? '#4a5568' : '#e2e8f0'};
    padding-bottom: 0.3rem;
  }
  h3 { font-size: 1.75rem; }
  h4 { font-size: 1.5rem; }
  h5 { font-size: 1.25rem; }
  h6 { font-size: 1.1rem; color: ${props => props.theme === 'dark' ? '#a0aec0' : '#666'}; }
  
  p {
    margin-bottom: 1rem;
    text-align: justify;
  }
  
  blockquote {
    border-left: 4px solid #667eea;
    padding-left: 1rem;
    margin: 1rem 0;
    color: ${props => props.theme === 'dark' ? '#a0aec0' : '#666'};
    font-style: italic;
    background: ${props => props.theme === 'dark' ? '#2d3748' : '#f8f9ff'};
    padding: 1rem;
    border-radius: 0 8px 8px 0;
  }
  
  code {
    background: ${props => props.theme === 'dark' ? '#2d3748' : '#f4f4f4'};
    color: ${props => props.theme === 'dark' ? '#ff6b6b' : '#e53e3e'};
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9em;
  }
  
  pre {
    background: ${props => props.theme === 'dark' ? '#1a202c' : '#f8f8f8'};
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;
    border: 1px solid ${props => props.theme === 'dark' ? '#4a5568' : '#e2e8f0'};
    
    code {
      background: none;
      color: inherit;
      padding: 0;
    }
  }
  
  ul, ol {
    margin: 1rem 0;
    padding-left: 2rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  ul li::marker {
    color: #667eea;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
    border: 1px solid ${props => props.theme === 'dark' ? '#4a5568' : '#ddd'};
    border-radius: 8px;
    overflow: hidden;
  }
  
  th, td {
    border: 1px solid ${props => props.theme === 'dark' ? '#4a5568' : '#ddd'};
    padding: 0.75rem;
    text-align: left;
  }
  
  th {
    background: ${props => props.theme === 'dark' ? '#2d3748' : '#f8f9fa'};
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background: ${props => props.theme === 'dark' ? '#2d3748' : '#f8f9ff'};
  }
  
  a {
    color: #667eea;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
    
    &:hover {
      border-bottom-color: #667eea;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    margin: 1rem 0;
  }
  
  hr {
    border: none;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    margin: 2rem 0;
    border-radius: 1px;
  }
  
  .task-list-item {
    list-style: none;
    margin-left: -1.5rem;
  }
  
  .task-list-item input {
    margin-right: 0.5rem;
  }
`;

export const Toolbar = styled.div<{ theme: 'light' | 'dark' }>`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${props => props.theme === 'dark' ? '#2d3748' : '#f8f9fa'};
  border-bottom: 1px solid ${props => props.theme === 'dark' ? '#4a5568' : '#e1e5e9'};
  flex-wrap: wrap;
  align-items: center;
`;

export const ToolbarGroup = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  
  &:not(:last-child)::after {
    content: '';
    width: 1px;
    height: 20px;
    background: #ddd;
    margin-left: 0.5rem;
  }
`;

export const ToolbarButton = styled.button<{ active?: boolean; theme?: 'light' | 'dark' }>`
  background: ${props => props.active ? '#667eea' : (props.theme === 'dark' ? '#4a5568' : 'white')};
  color: ${props => props.active ? 'white' : (props.theme === 'dark' ? '#e2e8f0' : '#333')};
  border: 1px solid ${props => props.theme === 'dark' ? '#4a5568' : '#ddd'};
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 32px;
  justify-content: center;
  
  &:hover {
    background: ${props => props.active ? '#5a6fd8' : (props.theme === 'dark' ? '#2d3748' : '#e9ecef')};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const TitleInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: none;
  border-bottom: 1px solid #e1e5e9;
  font-size: 1.25rem;
  font-weight: 600;
  outline: none;
  background: white;
  
  &::placeholder {
    color: #999;
  }
`;

export const SaveStatus = styled.div<{ saved: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.saved ? '#d4edda' : '#f8d7da'};
  color: ${props => props.saved ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.saved ? '#c3e6cb' : '#f5c6cb'};
  transition: all 0.3s ease;
`;

export const EditorActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e1e5e9;
`;

export const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #667eea;
          color: white;
          &:hover { background: #5a6fd8; }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      default:
        return `
          background: #f8f9fa;
          color: #333;
          border: 1px solid #ddd;
          &:hover { background: #e9ecef; }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  background: #f1f3f4;
  border-radius: 6px;
  padding: 2px;
  margin-left: auto;
`;

export const ViewButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? '#667eea' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#5a6fd8' : '#e9ecef'};
  }
`;

export const SettingsPanel = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  min-width: 250px;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

export const SettingGroup = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const SettingLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

export const SettingSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
`;

export const SettingSlider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

export const WordCount = styled.div`
  font-size: 0.8rem;
  color: #666;
  padding: 0.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e1e5e9;
  display: flex;
  justify-content: space-between;
`;

export const ExportButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  
  &:hover {
    background: #218838;
  }
`;

export const AIAssistantToggle = styled.button<{ isActive: boolean }>`
  background: ${props => props.isActive ? '#667eea' : '#6c757d'};
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  position: relative;
  
  &:hover {
    background: ${props => props.isActive ? '#5a6fd8' : '#5a6268'};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${props => props.isActive && `
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
  `}
`;

export const AIIcon = styled.span`
  font-size: 1.2rem;
  animation: ${props => props.theme === 'pulse' ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
`;
