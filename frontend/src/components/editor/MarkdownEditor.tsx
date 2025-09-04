import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MarkdownFile } from '../../types';
import ApiService from '../../services/api';
import AIAssistant from './AIAssistant';
import {
  EditorContainer,
  EditorPane,
  PreviewPane,
  PaneHeader,
  Textarea,
  PreviewContent,
  Toolbar,
  ToolbarGroup,
  ToolbarButton,
  ToolbarSection,
  ToolbarDivider,
  ToolbarLabel,
  FormatIndicator,
  TitleInput,
  SaveStatus,
  EditorActions,
  ActionButton,
  ViewToggle,
  ViewButton,
  SettingsPanel,
  SettingGroup,
  SettingLabel,
  SettingSelect,
  SettingSlider,
  ExportButton,
  AIAssistantToggle,
  AIIcon
} from './EditorStyles';

interface MarkdownEditorProps {
  isNewFile?: boolean;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ isNewFile = false }) => {
  const [file, setFile] = useState<MarkdownFile>({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(!isNewFile);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Options d'interface
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Charger le fichier existant
  useEffect(() => {
    if (!isNewFile && id) {
      loadFile(parseInt(id));
    }
  }, [id, isNewFile]);

  const loadFile = async (fileId: number) => {
    try {
      setLoading(true);
      const fileData = await ApiService.getFile(fileId);
      setFile(fileData);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Erreur lors du chargement du fichier:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Fonction de sauvegarde manuelle simplifiée
  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);
      
      // Générer un titre automatique si nécessaire
      let titleToSave = file.title.trim();
      if (!titleToSave) {
        const now = new Date();
        titleToSave = `Document ${now.toLocaleDateString('fr-FR')} ${now.toLocaleTimeString('fr-FR')}`;
      }

      if (isNewFile || !file.id) {
        // Créer un nouveau fichier
        console.log('Création d\'un nouveau fichier:', { title: titleToSave, content: file.content });
        const newFile = await ApiService.createFile({
          title: titleToSave,
          content: file.content
        });
        
        console.log('Fichier créé avec succès:', newFile);
        setFile(newFile);
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        
        // Rediriger vers l'URL avec l'ID
        navigate(`/editor/${newFile.id}`, { replace: true });
      } else {
        // Mettre à jour le fichier existant
        const updatedFile = await ApiService.updateFile(file.id, {
          title: titleToSave,
          content: file.content
        });
        setFile(updatedFile);
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du document');
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFile(prev => ({ ...prev, title: newTitle }));
    setHasUnsavedChanges(true);
  }, []);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setFile(prev => ({ ...prev, content: newContent }));
    setHasUnsavedChanges(true);
  }, []);

  // Raccourci clavier pour sauvegarder
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  // Alerte avant fermeture si modifications non sauvegardées
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <EditorActions>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ActionButton onClick={() => navigate('/dashboard')}>
            ← Retour au tableau de bord
          </ActionButton>
          
          <ActionButton 
            onClick={handleSave}
            disabled={saving}
            style={{ 
              background: hasUnsavedChanges ? '#e67e22' : '#27ae60',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {saving ? '💾 Sauvegarde...' : '💾 Sauvegarder'}
            {hasUnsavedChanges && ' *'}
          </ActionButton>

          <SaveStatus saved={!hasUnsavedChanges && !saving}>
            {saving && '💾 Sauvegarde en cours...'}
            {hasUnsavedChanges && !saving && '⚠️ Modifications non sauvegardées'}
            {!hasUnsavedChanges && !saving && lastSaved && `✅ Sauvegardé à ${lastSaved.toLocaleTimeString()}`}
            {!hasUnsavedChanges && !saving && !lastSaved && isNewFile && '📝 Nouveau document - Cliquez sur Sauvegarder'}
          </SaveStatus>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
          <span>💡 Utilisez Ctrl+S pour sauvegarder rapidement</span>
        </div>
      </EditorActions>

      <TitleInput
        value={file.title}
        onChange={handleTitleChange}
        placeholder="Titre du document (généré automatiquement si vide)..."
      />

      <Toolbar theme={theme}>
        <ToolbarSection>
          <ViewToggle>
            <ViewButton 
              active={viewMode === 'editor'} 
              onClick={() => setViewMode('editor')} 
            >
              📝 Éditeur
            </ViewButton>
            <ViewButton 
              active={viewMode === 'split'} 
              onClick={() => setViewMode('split')} 
            >
              ⚏ Divisé
            </ViewButton>
            <ViewButton 
              active={viewMode === 'preview'} 
              onClick={() => setViewMode('preview')} 
            >
              👁️ Aperçu
            </ViewButton>
          </ViewToggle>

          <ToolbarButton 
            theme={theme} 
            onClick={() => setShowSettings(!showSettings)} 
          >
            ⚙️ Paramètres
          </ToolbarButton>
        </ToolbarSection>

        <SettingsPanel isOpen={showSettings}>
          <SettingGroup>
            <SettingLabel>Thème</SettingLabel>
            <SettingSelect value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}>
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
            </SettingSelect>
          </SettingGroup>
          
          <SettingGroup>
            <SettingLabel>Taille de police: {fontSize}px</SettingLabel>
            <SettingSlider 
              type="range" 
              min="10" 
              max="24" 
              value={fontSize} 
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </SettingGroup>
        </SettingsPanel>
      </Toolbar>

      <EditorContainer layout={viewMode}>
        <EditorPane className="editor-pane">
          <PaneHeader>Éditeur</PaneHeader>
          <Textarea
            ref={textareaRef}
            theme={theme}
            fontSize={fontSize}
            value={file.content}
            onChange={handleContentChange}
            placeholder="Commencez à écrire votre document en Markdown..."
          />
        </EditorPane>

        <PreviewPane className="preview-pane">
          <PaneHeader>Aperçu</PaneHeader>
          <PreviewContent theme={theme} fontSize={fontSize}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const {children, className} = props;
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <SyntaxHighlighter
                      style={tomorrow as any}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {file.content || '*Votre aperçu apparaîtra ici...*'}
            </ReactMarkdown>
          </PreviewContent>
        </PreviewPane>
      </EditorContainer>
    </div>
  );
};

export default MarkdownEditor;
