import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors, spacing, shadows, borderRadius, typography, transitions, Button, Input } from '../../styles/GlobalStyles';
import OverleafLayout from '../layout/OverleafLayout';
import TagManager from './TagManager';
import { MarkdownFile, Tag } from '../../types';
import ApiService from '../../services/api';
import geminiService from '../../services/geminiService';

// Composants d'icônes simples en SVG pour éviter les problèmes de types
const IconWrapper = styled.div<{ size?: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || 16}px;
  height: ${props => props.size || 16}px;
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
`;

const SearchIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  </IconWrapper>
);

const FileIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10,9 9,9 8,9"/>
    </svg>
  </IconWrapper>
);

const CopyIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  </IconWrapper>
);

const DownloadIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7,10 12,15 17,10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  </IconWrapper>
);

const ArchiveIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="21,8 21,21 3,21 3,8"/>
      <rect x="1" y="3" width="22" height="5"/>
      <line x1="10" y1="12" x2="14" y2="12"/>
    </svg>
  </IconWrapper>
);

const TrashIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,6 5,6 21,6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  </IconWrapper>
);

const InfoIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  </IconWrapper>
);

const SettingsIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  </IconWrapper>
);

const CheckIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  </IconWrapper>
);

const FileTextIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <IconWrapper size={size}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10,9 9,9 8,9"/>
    </svg>
  </IconWrapper>
);

// Types pour les filtres
type FilterType = 'all' | 'mine' | 'shared' | 'archived' | 'trash';

// Styles spécifiques au Dashboard style Overleaf
const DashboardContainer = styled.div`
  padding: ${spacing.xl};
  max-width: 100%;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.xl};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${spacing.lg};
    align-items: stretch;
  }
`;

const HeaderTitle = styled.h1`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.textPrimary};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;
  
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const StatusBadge = styled.span<{ $isActive?: boolean }>`
  background: ${props => props.$isActive ? '#22c55e' : '#dc2626'};
  color: ${colors.white};
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${borderRadius.full};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: ${spacing.xl};
`;

const SearchInput = styled(Input)`
  padding-left: 2.5rem;
  border-radius: ${borderRadius.md};
  
  &::placeholder {
    color: ${colors.textMuted};
  }
`;

const SearchIconContainer = styled.div`
  position: absolute;
  left: ${spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.textMuted};
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const ProjectsTable = styled.div`
  background: ${colors.white};
  border-radius: ${borderRadius.lg};
  border: 1px solid ${colors.borderLight};
  overflow: hidden;
  box-shadow: ${shadows.sm};
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px 200px;
  background: ${colors.lightGray};
  border-bottom: 1px solid ${colors.borderLight};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TableHeaderCell = styled.div<{ $hide?: boolean }>`
  padding: ${spacing.lg};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.textSecondary};
  border-right: 1px solid ${colors.borderLight};
  
  &:last-child {
    border-right: none;
  }
  
  @media (max-width: 768px) {
    display: ${props => props.$hide ? 'none' : 'block'};
  }
`;

const TableBody = styled.div``;

const TableRow = styled.div<{ isSelected?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 200px 200px;
  border-bottom: 1px solid ${colors.borderLight};
  cursor: pointer;
  transition: all ${transitions.fast};
  background: ${props => props.isSelected ? colors.active : colors.white};
  
  &:hover {
    background: ${colors.hover};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TableCell = styled.div<{ $hide?: boolean }>`
  padding: ${spacing.lg};
  border-right: 1px solid ${colors.borderLight};
  display: flex;
  align-items: center;
  
  &:last-child {
    border-right: none;
  }
  
  @media (max-width: 768px) {
    display: ${props => props.$hide ? 'none' : 'flex'};
  }
`;

const ProjectTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const ProjectIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textSecondary};
`;

const ProjectName = styled.span`
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textPrimary};
`;

const ProjectMeta = styled.span`
  font-size: ${typography.fontSize.sm};
  color: ${colors.textSecondary};
`;

const ProjectTags = styled.div`
  display: flex;
  gap: ${spacing.xs};
  flex-wrap: wrap;
  margin-top: ${spacing.sm};
`;

const DropZone = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed ${props => props.isDragOver ? colors.primary : 'transparent'};
  border-radius: ${borderRadius.md};
  transition: all ${transitions.fast};
  
  ${props => props.isDragOver && `
    background: rgba(19, 138, 54, 0.05);
  `}
`;

const TagChip = styled.div<{ color: string; isDragging?: boolean }>`
  background: ${props => props.color};
  color: ${colors.white};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.full};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  display: inline-flex;
  align-items: center;
  gap: ${spacing.xs};
  cursor: grab;
  opacity: ${props => props.isDragging ? 0.5 : 1};
  
  &:active {
    cursor: grabbing;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing['4xl']};
  color: ${colors.textMuted};
`;

const EmptyStateIcon = styled.div`
  font-size: ${typography.fontSize['4xl']};
  margin-bottom: ${spacing.lg};
  opacity: 0.5;
  display: flex;
  justify-content: center;
  color: ${colors.textMuted};
`;

const EmptyStateText = styled.p`
  font-size: ${typography.fontSize.lg};
  margin-bottom: ${spacing.xl};
`;

const ProjectCount = styled.div`
  padding: ${spacing.lg};
  border-top: 1px solid ${colors.borderLight};
  background: ${colors.lightGray};
  font-size: ${typography.fontSize.sm};
  color: ${colors.textSecondary};
  text-align: center;
`;

const ProjectActions = styled.div`
  display: flex;
  gap: ${spacing.sm};
  align-items: center;
`;

// Barre d'outils pour les actions sur les documents sélectionnés
const ToolbarContainer = styled.div<{ visible: boolean }>`
  background: ${colors.white};
  border: 1px solid ${colors.borderLight};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  margin-bottom: ${spacing.xl};
  box-shadow: ${shadows.sm};
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: space-between;
  transition: all ${transitions.fast};
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
`;

const ToolbarActions = styled.div`
  display: flex;
  gap: ${spacing.md};
  align-items: center;
`;

const SelectedCount = styled.span`
  font-size: ${typography.fontSize.sm};
  color: ${colors.textPrimary};
  font-weight: ${typography.fontWeight.medium};
`;

const ActionButton = styled.button<{ variant?: 'copy' | 'download' | 'archive' | 'delete' | 'select' }>`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colors.border};
  background: ${colors.white};
  cursor: pointer;
  border-radius: ${borderRadius.md};
  font-size: ${typography.fontSize.sm};
  transition: all ${transitions.fast};
  color: ${colors.textPrimary};
  
  &:hover {
    background: ${colors.hover};
    border-color: ${colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => props.variant === 'delete' && `
    &:hover {
      background: ${colors.accent};
      color: ${colors.white};
      border-color: ${colors.accent};
    }
  `}
`;

const SelectAllButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  font-size: ${typography.fontSize.sm};
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: ${colors.primaryDark};
  }
`;

// Styles pour le modal de mise à niveau
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing['2xl']};
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${shadows.lg};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.xl};
`;

const ModalTitle = styled.h2`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.textPrimary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${typography.fontSize.xl};
  color: ${colors.textMuted};
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${borderRadius.md};
  
  &:hover {
    background: ${colors.hover};
    color: ${colors.textPrimary};
  }
`;

const ModalBody = styled.div`
  margin-bottom: ${spacing.xl};
`;

const ModalText = styled.p`
  color: ${colors.textSecondary};
  margin-bottom: ${spacing.lg};
  line-height: 1.5;
`;

const FormGroup = styled.div`
  margin-bottom: ${spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.sm};
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${spacing.md};
  justify-content: flex-end;
`;

const StatusMessage = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.lg};
  font-size: ${typography.fontSize.sm};
  
  ${props => props.type === 'success' && `
    background: rgba(34, 197, 94, 0.1);
    color: #059669;
    border: 1px solid rgba(34, 197, 94, 0.2);
  `}
  
  ${props => props.type === 'error' && `
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.2);
  `}
  
  ${props => props.type === 'info' && `
    background: rgba(59, 130, 246, 0.1);
    color: #2563eb;
    border: 1px solid rgba(59, 130, 246, 0.2);
  `}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid ${colors.borderLight};
  border-radius: 50%;
  border-top-color: ${colors.primary};
  animation: spin 1s ease-in-out infinite;
  margin-right: ${spacing.sm};
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Bouton personnalisé pour la gestion de la clé API
const PremiumButton = styled(Button)<{ $isActive?: boolean }>`
  background: ${props => props.$isActive ? '#22c55e' : '#3b82f6'};
  border: 1px solid ${props => props.$isActive ? '#22c55e' : '#3b82f6'};
  
  &:hover {
    background: ${props => props.$isActive ? '#16a34a' : '#2563eb'};
    border-color: ${props => props.$isActive ? '#16a34a' : '#2563eb'};
  }
`;

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<MarkdownFile[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [showTagManager, setShowTagManager] = useState(false);
  const [draggedTag, setDraggedTag] = useState<Tag | null>(null);
  const [dragOverFile, setDragOverFile] = useState<number | null>(null);
  
  // États pour le modal de mise à niveau
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [isUpgraded, setIsUpgraded] = useState(false);
  
  const navigate = useNavigate();

  // Chargement initial des données
  useEffect(() => {
    loadData();
    // Vérifier si l'utilisateur a déjà une clé API configurée
    checkExistingApiKey();
  }, []);

  // Filtrage des fichiers
  useEffect(() => {
    filterFiles();
  }, [files, searchTerm, currentFilter, selectedTags]);

  const checkExistingApiKey = () => {
    const existingKey = localStorage.getItem('gemini_api_key');
    if (existingKey) {
      setIsUpgraded(true);
      geminiService.initialize(existingKey);
    }
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
    setValidationMessage(null);
    setApiKey('');
  };

  const handleCloseUpgradeModal = () => {
    setShowUpgradeModal(false);
    setApiKey('');
    setValidationMessage(null);
    setIsValidating(false);
  };

  const validateApiKey = async (key: string): Promise<boolean> => {
    try {
      return await geminiService.testApiKey(key);
    } catch (error) {
      console.error('Erreur de validation:', error);
      return false;
    }
  };

  const handleValidateAndSave = async () => {
    if (!apiKey.trim()) {
      setValidationMessage({
        type: 'error',
        text: 'Veuillez saisir une clé API'
      });
      return;
    }

    setIsValidating(true);
    setValidationMessage({
      type: 'info',
      text: 'Validation de la clé API en cours...'
    });

    try {
      const isValid = await validateApiKey(apiKey.trim());
      
      if (isValid) {
        // Sauvegarder la clé API
        localStorage.setItem('gemini_api_key', apiKey.trim());
        setIsUpgraded(true);
        setValidationMessage({
          type: 'success',
          text: 'Clé API validée avec succès ! Vous avez maintenant accès aux fonctionnalités IA.'
        });
        
        // Fermer le modal après 2 secondes
        setTimeout(() => {
          handleCloseUpgradeModal();
        }, 2000);
      } else {
        setValidationMessage({
          type: 'error',
          text: 'Clé API invalide. Veuillez vérifier que votre clé est correcte et réessayez.'
        });
      }
    } catch (error) {
      setValidationMessage({
        type: 'error',
        text: 'Erreur lors de la validation. Veuillez réessayer.'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [filesData, tagsData] = await Promise.all([
        ApiService.getFiles(),
        ApiService.getTags()
      ]);
      setFiles(filesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFiles = useCallback(() => {
    let filtered = [...files];

    // Filtre par type
    switch (currentFilter) {
      case 'mine':
        filtered = filtered.filter(file => !file.is_shared);
        break;
      case 'shared':
        filtered = filtered.filter(file => file.is_shared);
        break;
      case 'archived':
        filtered = filtered.filter(file => file.is_archived);
        break;
      case 'trash':
        // Pour l'instant, pas de corbeille implémentée
        filtered = [];
        break;
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par étiquettes
    if (selectedTags.length > 0) {
      filtered = filtered.filter(file =>
        file.tags?.some(tag => selectedTags.includes(tag.id!))
      );
    }

    setFilteredFiles(filtered);
  }, [files, searchTerm, currentFilter, selectedTags]);

  const handleNewProject = () => {
    navigate('/editor/new');
  };

  const handleDeleteFile = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        await ApiService.deleteFile(id);
        setFiles(files.filter(file => file.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleArchiveFile = async (id: number) => {
    try {
      await ApiService.archiveFile(id);
      setFiles(files.map(file => 
        file.id === id ? { ...file, is_archived: true } : file
      ));
    } catch (error) {
      console.error('Erreur lors de l\'archivage:', error);
    }
  };

  const handleDuplicateFile = async (file: MarkdownFile) => {
    try {
      const newFile = await ApiService.createFile({
        title: `${file.title} (copie)`,
        content: file.content
      });
      setFiles([newFile, ...files]);
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
    }
  };

  // Gestion du drag & drop des étiquettes
  const handleTagDragStart = (tag: Tag) => {
    setDraggedTag(tag);
  };

  const handleTagDragEnd = () => {
    setDraggedTag(null);
    setDragOverFile(null);
  };

  const handleFileDragOver = (e: React.DragEvent, fileId: number) => {
    e.preventDefault();
    setDragOverFile(fileId);
  };

  const handleFileDragLeave = () => {
    setDragOverFile(null);
  };

  const handleFileDrop = async (e: React.DragEvent, fileId: number) => {
    e.preventDefault();
    setDragOverFile(null);
    
    if (draggedTag && draggedTag.id) {
      try {
        await ApiService.addTagToFile(fileId, draggedTag.id);
        setFiles(files.map(file => {
          if (file.id === fileId) {
            const updatedTags = [...(file.tags || []), draggedTag];
            return { ...file, tags: updatedTags };
          }
          return file;
        }));
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'étiquette:', error);
      }
    }
  };

  const handleRemoveTagFromFile = async (fileId: number, tagId: number) => {
    try {
      await ApiService.removeTagFromFile(fileId, tagId);
      setFiles(files.map(file => {
        if (file.id === fileId) {
          const updatedTags = file.tags?.filter(tag => tag.id !== tagId) || [];
          return { ...file, tags: updatedTags };
        }
        return file;
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'étiquette:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'il y a un jour par Vous';
    if (diffDays < 30) return `${diffDays} jours par Vous`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} mois${months > 1 ? 's' : ''} ago by Vous`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} année${years > 1 ? 's' : ''} ago by Vous`;
  };

  // Nouvelles fonctions pour les actions en lot
  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id!));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedFiles.length} document(s) ?`)) {
      try {
        await Promise.all(selectedFiles.map(id => ApiService.deleteFile(id)));
        setFiles(files.filter(file => !selectedFiles.includes(file.id!)));
        setSelectedFiles([]);
      } catch (error) {
        console.error('Erreur lors de la suppression en lot:', error);
      }
    }
  };

  const handleBulkArchive = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      await Promise.all(selectedFiles.map(id => ApiService.archiveFile(id)));
      setFiles(files.map(file => 
        selectedFiles.includes(file.id!) 
          ? { ...file, is_archived: true } 
          : file
      ));
      setSelectedFiles([]);
    } catch (error) {
      console.error('Erreur lors de l\'archivage en lot:', error);
    }
  };

  const handleBulkDuplicate = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      const filesToDuplicate = files.filter(file => selectedFiles.includes(file.id!));
      const newFiles = await Promise.all(
        filesToDuplicate.map(file => 
          ApiService.createFile({
            title: `${file.title} (copie)`,
            content: file.content
          })
        )
      );
      setFiles([...newFiles, ...files]);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Erreur lors de la duplication en lot:', error);
    }
  };

  const handleBulkDownload = () => {
    if (selectedFiles.length === 0) return;
    
    const filesToDownload = files.filter(file => selectedFiles.includes(file.id!));
    filesToDownload.forEach(file => {
      const element = document.createElement('a');
      const fileContent = new Blob([file.content], { type: 'text/markdown' });
      element.href = URL.createObjectURL(fileContent);
      element.download = `${file.title || 'document'}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  };

  const toggleFileSelection = (fileId: number) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };

  const sidebarContent = (
    <div>
      <Button 
        $variant="primary" 
        $fullWidth 
        onClick={handleNewProject}
        style={{ marginBottom: spacing.xl }}
      >
        Nouveau document
      </Button>
      
      <div style={{ marginBottom: spacing.xl }}>
        <h4 style={{ 
          fontSize: typography.fontSize.sm, 
          fontWeight: typography.fontWeight.semibold,
          color: colors.textPrimary,
          marginBottom: spacing.lg 
        }}>
          Tous les projets
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
          <Button
            $variant={currentFilter === 'mine' ? 'primary' : 'ghost'}
            $size="sm"
            $fullWidth
            onClick={() => setCurrentFilter('mine')}
            style={{ justifyContent: 'flex-start' }}
          >
            Mes projets
          </Button>
          <Button
            $variant={currentFilter === 'shared' ? 'primary' : 'ghost'}
            $size="sm"
            $fullWidth
            onClick={() => setCurrentFilter('shared')}
            style={{ justifyContent: 'flex-start' }}
          >
            Partagé avec moi
          </Button>
          <Button
            $variant={currentFilter === 'archived' ? 'primary' : 'ghost'}
            $size="sm"
            $fullWidth
            onClick={() => setCurrentFilter('archived')}
            style={{ justifyContent: 'flex-start' }}
          >
            Projets archivés
          </Button>
          <Button
            $variant={currentFilter === 'trash' ? 'primary' : 'ghost'}
            $size="sm"
            $fullWidth
            onClick={() => setCurrentFilter('trash')}
            style={{ justifyContent: 'flex-start' }}
          >
            Corbeille des projets
          </Button>
        </div>
      </div>
      
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: spacing.lg 
        }}>
          <h4 style={{ 
            fontSize: typography.fontSize.sm, 
            fontWeight: typography.fontWeight.semibold,
            color: colors.textPrimary,
            margin: 0
          }}>
            ÉTIQUETTES
          </h4>
          <Button 
            $variant="ghost" 
            $size="sm"
            onClick={() => setShowTagManager(true)}
            style={{ padding: spacing.xs }}
          >
            <SettingsIcon />
          </Button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
          {tags.map(tag => (
            <TagChip
              key={tag.id}
              color={tag.color}
              draggable
              onDragStart={() => handleTagDragStart(tag)}
              onDragEnd={handleTagDragEnd}
              onClick={() => {
                if (selectedTags.includes(tag.id!)) {
                  setSelectedTags(selectedTags.filter(id => id !== tag.id));
                } else {
                  setSelectedTags([...selectedTags, tag.id!]);
                }
              }}
              style={{ 
                opacity: selectedTags.includes(tag.id!) ? 1 : 0.7,
                transform: selectedTags.includes(tag.id!) ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {tag.name}
              {selectedTags.includes(tag.id!) && <CheckIcon />}
            </TagChip>
          ))}
          
          <Button 
            $variant="ghost" 
            $size="sm"
            onClick={() => setShowTagManager(true)}
            style={{ justifyContent: 'flex-start', width: '100%' }}
          >
            + Nouvelle étiquette
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <OverleafLayout sidebarContent={sidebarContent}>
      <DashboardContainer>
        <HeaderSection>
          <HeaderTitle>
            {currentFilter === 'all' && 'Tous les projets'}
            {currentFilter === 'mine' && 'Mes projets'}
            {currentFilter === 'shared' && 'Partagé avec moi'}
            {currentFilter === 'archived' && 'Projets archivés'}
            {currentFilter === 'trash' && 'Corbeille'}
          </HeaderTitle>
          <HeaderActions>
            <StatusBadge $isActive={isUpgraded}>
              <InfoIcon />
              {isUpgraded ? 'Clé premium activée' : 'Clé premium désactivée'}
            </StatusBadge>
            <PremiumButton 
              $variant="primary" 
              $size="sm"
              $isActive={isUpgraded}
              onClick={handleUpgradeClick}
            >
              {isUpgraded ? 'Gérer la clé API' : 'Mettre à niveau'}
            </PremiumButton>
          </HeaderActions>
        </HeaderSection>

        <SearchContainer>
          <SearchIconContainer>
            <SearchIcon />
          </SearchIconContainer>
          <SearchInput
            type="text"
            placeholder="Rechercher dans tous les projets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        {/* Barre d'outils pour les actions en lot */}
        <ToolbarContainer visible={selectedFiles.length > 0}>
          <ToolbarLeft>
            <SelectedCount>
              {selectedFiles.length} document(s) sélectionné(s)
            </SelectedCount>
            <SelectAllButton onClick={handleSelectAll}>
              {selectedFiles.length === filteredFiles.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </SelectAllButton>
          </ToolbarLeft>
          
          <ToolbarActions>
            <ActionButton 
              variant="copy" 
              onClick={handleBulkDuplicate}
              disabled={selectedFiles.length === 0}
            >
              <CopyIcon />
              Dupliquer
            </ActionButton>
            <ActionButton 
              variant="download" 
              onClick={handleBulkDownload}
              disabled={selectedFiles.length === 0}
            >
              <DownloadIcon />
              Télécharger
            </ActionButton>
            <ActionButton 
              variant="archive" 
              onClick={handleBulkArchive}
              disabled={selectedFiles.length === 0}
            >
              <ArchiveIcon />
              Archiver
            </ActionButton>
            <ActionButton 
              variant="delete" 
              onClick={handleBulkDelete}
              disabled={selectedFiles.length === 0}
            >
              <TrashIcon />
              Supprimer
            </ActionButton>
          </ToolbarActions>
        </ToolbarContainer>

        {selectedTags.length > 0 && (
          <div style={{ marginBottom: spacing.lg }}>
            <span style={{ fontSize: typography.fontSize.sm, color: colors.textSecondary }}>
              Filtré par étiquettes: 
            </span>
            {selectedTags.map(tagId => {
              const tag = tags.find(t => t.id === tagId);
              return tag ? (
                <TagChip
                  key={tag.id}
                  color={tag.color}
                  style={{ marginLeft: spacing.sm }}
                >
                  {tag.name}
                  <button
                    onClick={() => setSelectedTags(selectedTags.filter(id => id !== tagId))}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'inherit', 
                      marginLeft: spacing.xs,
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                </TagChip>
              ) : null;
            })}
          </div>
        )}

        <ProjectsTable>
          <TableHeader>
            <TableHeaderCell>
              <input
                type="checkbox"
                checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                onChange={handleSelectAll}
                style={{ marginRight: spacing.sm }}
              />
              Titre
            </TableHeaderCell>
            <TableHeaderCell $hide>Propriétaire</TableHeaderCell>
            <TableHeaderCell $hide>Dernière modification</TableHeaderCell>
          </TableHeader>
          
          <TableBody>
            {loading ? (
              <div style={{ padding: spacing['3xl'], textAlign: 'center' }}>
                <div className="animate-pulse">Chargement...</div>
              </div>
            ) : filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <DropZone
                  key={file.id}
                  isDragOver={dragOverFile === file.id}
                  onDragOver={(e) => handleFileDragOver(e, file.id!)}
                  onDragLeave={handleFileDragLeave}
                  onDrop={(e) => handleFileDrop(e, file.id!)}
                >
                  <TableRow 
                    onClick={() => navigate(`/editor/${file.id}`)}
                    isSelected={selectedFiles.includes(file.id!)}
                  >
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id!)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleFileSelection(file.id!);
                          }}
                        />
                        <div>
                          <ProjectTitle>
                            <ProjectIcon>
                              <FileIcon />
                            </ProjectIcon>
                            <ProjectName>
                              {file.title || 'Document sans titre'}
                            </ProjectName>
                          </ProjectTitle>
                          {file.tags && file.tags.length > 0 && (
                            <ProjectTags>
                              {file.tags.map(tag => (
                                <TagChip
                                  key={tag.id}
                                  color={tag.color}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveTagFromFile(file.id!, tag.id!);
                                  }}
                                  style={{ cursor: 'pointer' }}
                                >
                                  {tag.name} ×
                                </TagChip>
                              ))}
                            </ProjectTags>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell $hide>
                      <ProjectMeta>Vous</ProjectMeta>
                    </TableCell>
                    <TableCell $hide>
                      <ProjectMeta>
                        {formatDate(file.updated_at || file.created_at || '')}
                      </ProjectMeta>
                    </TableCell>
                  </TableRow>
                </DropZone>
              ))
            ) : (
              <EmptyState>
                <EmptyStateIcon>
                  <FileTextIcon />
                </EmptyStateIcon>
                <EmptyStateText>
                  {searchTerm || selectedTags.length > 0 ? 'Aucun projet trouvé' : 'Aucun projet pour le moment'}
                </EmptyStateText>
                {!searchTerm && selectedTags.length === 0 && (
                  <Button 
                    $variant="primary"
                    onClick={handleNewProject}
                  >
                    Créer votre premier projet
                  </Button>
                )}
              </EmptyState>
            )}
          </TableBody>
          
          {filteredFiles.length > 0 && (
            <ProjectCount>
              Affiche {filteredFiles.length} sur {files.length} projets.
            </ProjectCount>
          )}
        </ProjectsTable>
      </DashboardContainer>

      {/* Modal de mise à niveau */}
      {showUpgradeModal && (
        <ModalOverlay onClick={handleCloseUpgradeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {isUpgraded ? 'Gérer votre clé API Gemini' : 'Mettre à niveau vers Premium'}
              </ModalTitle>
              <CloseButton onClick={handleCloseUpgradeModal}>
                ×
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <ModalText>
                {isUpgraded 
                  ? 'Vous pouvez modifier votre clé API Gemini pour accéder aux fonctionnalités IA avancées.'
                  : 'Pour accéder aux fonctionnalités IA avancées de NoteMaster, veuillez saisir votre clé API Google Gemini.'
                }
              </ModalText>
              
              <ModalText>
                <strong>Comment obtenir une clé API :</strong><br />
                1. Visitez <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: colors.primary }}>Google AI Studio</a><br />
                2. Créez un compte ou connectez-vous<br />
                3. Générez une nouvelle clé API<br />
                4. Copiez et collez votre clé ci-dessous
              </ModalText>

              {validationMessage && (
                <StatusMessage type={validationMessage.type}>
                  {isValidating && <LoadingSpinner />}
                  {validationMessage.text}
                </StatusMessage>
              )}

              <FormGroup>
                <Label htmlFor="apiKey">Clé API Gemini</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Saisissez votre clé API Gemini..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={isValidating}
                />
              </FormGroup>
            </ModalBody>
            
            <ModalActions>
              <Button 
                $variant="ghost" 
                onClick={handleCloseUpgradeModal}
                disabled={isValidating}
              >
                Annuler
              </Button>
              <Button 
                $variant="primary"
                onClick={handleValidateAndSave}
                disabled={isValidating || !apiKey.trim()}
              >
                {isValidating ? 'Validation...' : (isUpgraded ? 'Mettre à jour' : 'Valider et activer')}
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      <TagManager
        isOpen={showTagManager}
        onClose={() => setShowTagManager(false)}
        onTagsChange={setTags}
        existingTags={tags}
      />
    </OverleafLayout>
  );
};

export default Dashboard;
