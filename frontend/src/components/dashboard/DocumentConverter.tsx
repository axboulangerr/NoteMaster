import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ApiService from '../../services/api';
import { ConversionResult } from '../../types';

const ConverterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DropZone = styled.div<{ isDragOver: boolean; hasFile: boolean }>`
  border: 2px dashed ${props => 
    props.isDragOver ? '#667eea' : 
    props.hasFile ? '#28a745' : '#ddd'
  };
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: ${props => 
    props.isDragOver ? '#f0f4ff' : 
    props.hasFile ? '#f8fff8' : '#fafafa'
  };
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #667eea;
    background: #f0f4ff;
  }
`;

const DropZoneIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
`;

const DropZoneText = styled.p`
  margin: 0;
  color: #666;
  font-size: 1.1rem;
`;

const FileInfo = styled.div`
  background: #e8f5e8;
  border: 1px solid #c3e6c3;
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FileName = styled.span`
  font-weight: 500;
  color: #155724;
`;

const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    background: #c82333;
  }
`;

const ConvertButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-start;
  
  &:hover:not(:disabled) {
    background: #5a6fd8;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #f5c6cb;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #c3e6cb;
`;

const ConversionPreview = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
`;

const PreviewTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const PreviewContent = styled.pre`
  white-space: pre-wrap;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #666;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SaveButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #218838;
  }
`;

const DiscardButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #5a6268;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

interface DocumentConverterProps {
  onConversionComplete: () => void;
}

const DocumentConverter: React.FC<DocumentConverterProps> = ({ onConversionComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    // Vérifier l'extension du fichier
    const allowedExtensions = ['.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      setError('Seuls les fichiers .doc et .docx sont acceptés');
      return;
    }
    
    setSelectedFile(file);
    setError('');
    setConversionResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    
    setIsConverting(true);
    setError('');
    
    try {
      const result = await ApiService.convertDocument(selectedFile);
      setConversionResult(result);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erreur lors de la conversion du fichier');
    } finally {
      setIsConverting(false);
    }
  };

  const handleSaveAsNewFile = async () => {
    if (!conversionResult) return;
    
    setIsSaving(true);
    
    try {
      const newFile = await ApiService.createFile({
        title: conversionResult.title,
        content: conversionResult.content
      });
      
      // Naviguer vers l'éditeur du nouveau fichier
      navigate(`/editor/${newFile.id}`);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setConversionResult(null);
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onConversionComplete();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setConversionResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ConverterContainer>
      {!selectedFile ? (
        <DropZone
          isDragOver={isDragOver}
          hasFile={!!selectedFile}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <DropZoneIcon>📄</DropZoneIcon>
          <DropZoneText>
            Glissez-déposez un fichier .doc ou .docx ici<br />
            ou cliquez pour sélectionner un fichier
          </DropZoneText>
        </DropZone>
      ) : (
        <FileInfo>
          <FileName>📄 {selectedFile.name}</FileName>
          <RemoveButton onClick={handleRemoveFile}>
            Supprimer
          </RemoveButton>
        </FileInfo>
      )}

      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept=".doc,.docx"
        onChange={handleFileInputChange}
      />

      {selectedFile && !conversionResult && (
        <ConvertButton 
          onClick={handleConvert} 
          disabled={isConverting}
        >
          {isConverting ? 'Conversion en cours...' : 'Convertir en Markdown'}
        </ConvertButton>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {conversionResult && (
        <>
          <SuccessMessage>
            Conversion réussie ! Aperçu du contenu converti :
          </SuccessMessage>
          
          <ConversionPreview>
            <PreviewTitle>Titre : {conversionResult.title}</PreviewTitle>
            <PreviewContent>
              {conversionResult.content.length > 1000 
                ? conversionResult.content.substring(0, 1000) + '...\n\n[Contenu tronqué pour l\'aperçu]'
                : conversionResult.content
              }
            </PreviewContent>
          </ConversionPreview>

          <ActionButtons>
            <SaveButton 
              onClick={handleSaveAsNewFile}
              disabled={isSaving}
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder comme nouveau document'}
            </SaveButton>
            <DiscardButton onClick={handleDiscard}>
              Ignorer
            </DiscardButton>
          </ActionButtons>
        </>
      )}
    </ConverterContainer>
  );
};

export default DocumentConverter;
