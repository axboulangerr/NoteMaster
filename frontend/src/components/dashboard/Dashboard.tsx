import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MarkdownFile } from '../../types';
import ApiService from '../../services/api';
import DocumentConverter from './DocumentConverter';
import {
  DashboardContainer,
  Header,
  Logo,
  UserInfo,
  UserName,
  LogoutButton,
  MainContent,
  ActionBar,
  SearchContainer,
  SearchInput,
  SearchButton,
  CreateButton,
  FilesGrid,
  FileCard,
  FileTitle,
  FilePreview,
  FileInfo,
  FileDate,
  FileActions,
  ActionIcon,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  LoadingContainer,
  LoadingSpinner,
  ConvertSection,
  SectionTitle
} from './DashboardStyles';

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async (search?: string) => {
    try {
      setLoading(true);
      const filesData = await ApiService.getFiles(search);
      setFiles(filesData);
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      await loadFiles(searchTerm.trim());
      setIsSearching(false);
    } else {
      await loadFiles();
    }
  };

  const handleClearSearch = async () => {
    setSearchTerm('');
    await loadFiles();
  };

  const handleDeleteFile = async (fileId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher l'ouverture du fichier
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      try {
        await ApiService.deleteFile(fileId);
        setFiles(files.filter(file => file.id !== fileId));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du fichier');
      }
    }
  };

  const handleFileClick = (fileId: number) => {
    navigate(`/editor/${fileId}`);
  };

  const handleCreateNew = () => {
    navigate('/editor/new');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilePreview = (content: string) => {
    // Enlever le markdown et limiter à 150 caractères
    const plainText = content
      .replace(/[#*`_\[\]()]/g, '') // Enlever les caractères markdown
      .replace(/\n/g, ' ') // Remplacer les retours à la ligne par des espaces
      .trim();
    
    return plainText.length > 150 
      ? plainText.substring(0, 150) + '...'
      : plainText || 'Document vide';
  };

  const handleConversionComplete = () => {
    // Recharger la liste des fichiers après une conversion
    loadFiles();
  };

  return (
    <DashboardContainer>
      <Header>
        <Logo>📝 NoteMaster</Logo>
        <UserInfo>
          <UserName>Bonjour, {user?.username}</UserName>
          <LogoutButton onClick={handleLogout}>
            Déconnexion
          </LogoutButton>
        </UserInfo>
      </Header>

      <MainContent>
        <ConvertSection>
          <SectionTitle>Convertir un document</SectionTitle>
          <DocumentConverter onConversionComplete={handleConversionComplete} />
        </ConvertSection>

        <ActionBar>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Rechercher dans vos documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <SearchButton onClick={handleSearch} disabled={isSearching}>
              {isSearching ? 'Recherche...' : 'Rechercher'}
            </SearchButton>
            {searchTerm && (
              <SearchButton onClick={handleClearSearch}>
                Effacer
              </SearchButton>
            )}
          </SearchContainer>
          
          <CreateButton onClick={handleCreateNew}>
            ➕ Nouveau document
          </CreateButton>
        </ActionBar>

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : files.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>📄</EmptyStateIcon>
            <EmptyStateText>
              {searchTerm 
                ? `Aucun document trouvé pour "${searchTerm}"`
                : 'Aucun document pour le moment'
              }
            </EmptyStateText>
            {!searchTerm && (
              <CreateButton onClick={handleCreateNew}>
                Créer votre premier document
              </CreateButton>
            )}
          </EmptyState>
        ) : (
          <FilesGrid>
            {files.map((file) => (
              <FileCard
                key={file.id}
                onClick={() => handleFileClick(file.id!)}
              >
                <FileTitle>{file.title}</FileTitle>
                <FilePreview>{getFilePreview(file.content)}</FilePreview>
                <FileInfo>
                  <FileDate>
                    Modifié le {formatDate(file.updated_at)}
                  </FileDate>
                  <FileActions>
                    <ActionIcon
                      className="delete"
                      onClick={(e) => handleDeleteFile(file.id!, e)}
                      title="Supprimer"
                    >
                      🗑️
                    </ActionIcon>
                  </FileActions>
                </FileInfo>
              </FileCard>
            ))}
          </FilesGrid>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
