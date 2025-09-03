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
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'pending' | 'error'>('saved');
  
  // Nouvelles options d'interface
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  
  // États pour l'assistant IA
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Système de sauvegarde locale pour éviter la perte de données
  const saveToLocalStorage = useCallback((content: string, title: string) => {
    const key = id ? `notemaster_file_${id}` : 'notemaster_new_file';
    localStorage.setItem(key, JSON.stringify({ content, title, timestamp: Date.now() }));
  }, [id]);

  const loadFromLocalStorage = useCallback(() => {
    const key = id ? `notemaster_file_${id}` : 'notemaster_new_file';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Erreur lors du chargement depuis localStorage:', error);
      }
    }
    return null;
  }, [id]);

  // Système de sauvegarde automatique intelligent
  const autoSave = useCallback(async (force = false) => {
    if (autoSaving) return;
    
    // Générer un titre automatique si nécessaire
    let titleToSave = file.title.trim();
    if (!titleToSave) {
      const now = new Date();
      titleToSave = `Document ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    }
    
    try {
      setAutoSaving(true);
      setSaveStatus('saving');
      
      if (isNewFile || !file.id) {
        // Créer un nouveau fichier
        const newFile = await ApiService.createFile({
          title: titleToSave,
          content: file.content
        });
        setFile(prev => ({ ...prev, ...newFile, title: titleToSave }));
        if (isNewFile) {
          navigate(`/editor/${newFile.id}`, { replace: true });
        }
      } else {
        // Mettre à jour le fichier existant
        const updatedFile = await ApiService.updateFile(file.id, {
          title: titleToSave,
          content: file.content
        });
        setFile(prev => ({ ...prev, ...updatedFile, title: titleToSave }));
      }
      
      setSaveStatus('saved');
      setLastSaved(new Date());
      
      // Nettoyer la sauvegarde locale après une sauvegarde réussie
      const key = file.id ? `notemaster_file_${file.id}` : 'notemaster_new_file';
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error);
      setSaveStatus('error');
    } finally {
      setAutoSaving(false);
    }
  }, [file.title, file.content, file.id, isNewFile, autoSaving, navigate]);

  // Débounce pour la sauvegarde automatique (3 secondes après modification)
  useEffect(() => {
    if (!file.content && !file.title) return;
    
    setSaveStatus('pending');
    const timeoutId = setTimeout(() => {
      autoSave();
    }, 3000); // Sauvegarde automatique après 3 secondes d'inactivité

    return () => clearTimeout(timeoutId);
  }, [file.content, file.title, autoSave]);

  // Débounce pour la sauvegarde locale (plus rapide)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (file.content || file.title) {
        saveToLocalStorage(file.content, file.title);
      }
    }, 500); // Sauvegarde locale après 0.5 seconde d'inactivité

    return () => clearTimeout(timeoutId);
  }, [file.content, file.title, saveToLocalStorage]);

  // Gestionnaire pour éviter la perte de données lors de la fermeture
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'pending' || saveStatus === 'saving') {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Vérifier que le focus est sur le textarea
      if (document.activeElement !== textareaRef.current) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            insertText('**', '**', 'texte en gras');
            break;
          case 'i':
            e.preventDefault();
            insertText('*', '*', 'texte en italique');
            break;
          case '1':
            e.preventDefault();
            setViewMode('editor');
            break;
          case '2':
            e.preventDefault();
            setViewMode('split');
            break;
          case '3':
            e.preventDefault();
            setViewMode('preview');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []); // Dépendances vides pour éviter les re-créations

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
      
      // Vérifier s'il y a une sauvegarde locale plus récente
      const localBackup = loadFromLocalStorage();
      if (localBackup && localBackup.timestamp > new Date(fileData.updated_at || 0).getTime()) {
        const useLocalBackup = window.confirm(
          'Une sauvegarde locale plus récente a été trouvée. Voulez-vous la restaurer ?'
        );
        if (useLocalBackup) {
          setFile({
            ...fileData,
            content: localBackup.content,
            title: localBackup.title
          });
          setSaveStatus('pending');
        } else {
          setFile(fileData);
          setSaveStatus('saved');
        }
      } else {
        setFile(fileData);
        setSaveStatus('saved');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du fichier:', error);
      
      // En cas d'erreur, essayer de charger depuis la sauvegarde locale
      const localBackup = loadFromLocalStorage();
      if (localBackup) {
        const useLocalBackup = window.confirm(
          'Impossible de charger le fichier depuis le serveur. Voulez-vous restaurer la sauvegarde locale ?'
        );
        if (useLocalBackup) {
          setFile({
            id: fileId,
            title: localBackup.title,
            content: localBackup.content
          });
          setSaveStatus('pending');
          setLoading(false);
          return;
        }
      }
      
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFile(prev => ({ ...prev, title: newTitle }));
    // La sauvegarde automatique se déclenchera via l'useEffect
  }, []);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setFile(prev => ({ ...prev, content: newContent }));
    // La sauvegarde automatique se déclenchera via l'useEffect
  }, []);

  // Fonctions pour la barre d'outils
  const insertText = useCallback((before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Sauvegarder la position actuelle
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Utiliser le contenu actuel du textarea pour éviter les problèmes de synchronisation
    const currentContent = textarea.value;
    const selectedText = currentContent.substring(start, end);
    const replacement = before + (selectedText || placeholder) + after;
    
    const newContent = 
      currentContent.substring(0, start) + 
      replacement + 
      currentContent.substring(end);
    
    // Mettre à jour l'état React
    setFile(prev => ({ ...prev, content: newContent }));
    // La sauvegarde automatique se déclenchera via l'useEffect
    
    // Repositionner le curseur après que React ait mis à jour le DOM
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = selectedText 
          ? start + replacement.length 
          : start + before.length + placeholder.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
  }, []);

  // Fonctions d'export
  const exportAsHtml = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${file.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 2rem; }
        h1, h2, h3, h4, h5, h6 { color: #333; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f8f8f8; padding: 1rem; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
    </style>
</head>
<body>
    <h1>${file.title}</h1>
    <!-- Le contenu HTML serait généré ici -->
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.title || 'document'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsMarkdown = () => {
    const blob = new Blob([file.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.title || 'document'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsText = () => {
    // Enlever le markdown pour avoir du texte brut
    const plainText = file.content
      .replace(/[#*`_[\]()]/g, '')
      .replace(/\n/g, '\n');
    
    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.title || 'document'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Fonctions pour l'assistant IA
  const handleTextSelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    
    setSelectionStart(start);
    setSelectionEnd(end);
    setSelectedText(selected);
  }, []);

  const handleAITextReplace = useCallback((newText: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const currentContent = textarea.value;
    const newContent = 
      currentContent.substring(0, selectionStart) + 
      newText + 
      currentContent.substring(selectionEnd);
    
    setFile(prev => ({ ...prev, content: newContent }));
    
    // Repositionner le curseur après le nouveau texte
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPosition = selectionStart + newText.length;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 10);
    
    // Réinitialiser la sélection
    setSelectedText('');
    setSelectionStart(0);
    setSelectionEnd(0);
  }, [selectionStart, selectionEnd]);

  const handleAITextInsert = useCallback((text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const currentContent = textarea.value;
    const newContent = 
      currentContent.substring(0, cursorPosition) + 
      text + 
      currentContent.substring(cursorPosition);
    
    setFile(prev => ({ ...prev, content: newContent }));
    
    // Repositionner le curseur après le nouveau texte
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPosition = cursorPosition + text.length;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 10);
  }, []);

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
          <SaveStatus saved={saveStatus === 'saved'}>
            {saveStatus === 'saving' && '💾 Sauvegarde en cours...'}
            {saveStatus === 'pending' && '⏳ Sauvegarde automatique dans 3s...'}
            {saveStatus === 'saved' && lastSaved && `✅ Sauvegardé à ${lastSaved.toLocaleTimeString()}`}
            {saveStatus === 'error' && '❌ Erreur de sauvegarde'}
            {saveStatus === 'saved' && !lastSaved && '📝 Nouveau document'}
          </SaveStatus>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
          <span>💡 Sauvegarde automatique activée</span>
        </div>
      </EditorActions>

      <TitleInput
        value={file.title}
        onChange={handleTitleChange}
        placeholder="Titre du document (optionnel - généré automatiquement si vide)..."
      />

      <Toolbar theme={theme}>
        {/* Formatage de base */}
        <ToolbarGroup>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('**', '**', 'texte en gras')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Gras (Ctrl+B)"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('*', '*', 'texte en italique')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Italique (Ctrl+I)"
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('~~', '~~', 'texte barré')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Barré"
          >
            <s>S</s>
          </ToolbarButton>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('`', '`', 'code')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Code inline"
          >
            &lt;/&gt;
          </ToolbarButton>
        </ToolbarGroup>

        {/* Titres */}
        <ToolbarGroup>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('# ', '', 'Titre 1')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Titre 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('## ', '', 'Titre 2')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Titre 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('### ', '', 'Titre 3')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Titre 3"
          >
            H3
          </ToolbarButton>
        </ToolbarGroup>

        {/* Listes et éléments */}
        <ToolbarGroup>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('- ', '', 'élément de liste')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Liste à puces"
          >
            • Liste
          </ToolbarButton>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('1. ', '', 'élément numéroté')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Liste numérotée"
          >
            1. Liste
          </ToolbarButton>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('- [ ] ', '', 'tâche')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Case à cocher"
          >
            ☐ Tâche
          </ToolbarButton>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('> ', '', 'citation')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Citation"
          >
            " Citation
          </ToolbarButton>
        </ToolbarGroup>

        {/* Liens et médias */}
        <ToolbarGroup>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('[', '](url)', 'texte du lien')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Lien"
          >
            🔗 Lien
          </ToolbarButton>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('![alt](', ')', 'url-image')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Image"
          >
            🖼️ Image
          </ToolbarButton>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('\n```\n', '\n```\n', 'bloc de code')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Bloc de code"
          >
            { } Code
          </ToolbarButton>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('\n---\n', '', '')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Ligne horizontale"
          >
            ── HR
          </ToolbarButton>
        </ToolbarGroup>

        {/* Tableau */}
        <ToolbarGroup>
          <ToolbarButton 
            theme={theme} 
            onClick={() => insertText('\n| Colonne 1 | Colonne 2 |\n|-----------|-----------||\n| Cellule 1 | Cellule 2 |\n', '', '')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Tableau"
          >
            ⚏ Tableau
          </ToolbarButton>
        </ToolbarGroup>

        {/* Export */}
        <ToolbarGroup>
          <ExportButton 
            onClick={exportAsMarkdown} 
            onMouseDown={(e) => e.preventDefault()}
            title="Exporter en .md"
          >
            ⬇️ MD
          </ExportButton>
          <ExportButton 
            onClick={exportAsHtml} 
            onMouseDown={(e) => e.preventDefault()}
            title="Exporter en HTML"
          >
            ⬇️ HTML
          </ExportButton>
          <ExportButton 
            onClick={exportAsText} 
            onMouseDown={(e) => e.preventDefault()}
            title="Exporter en texte"
          >
            ⬇️ TXT
          </ExportButton>
        </ToolbarGroup>

        {/* Contrôles de vue et paramètres */}
        <ViewToggle>
          <ViewButton 
            active={viewMode === 'editor'} 
            onClick={() => setViewMode('editor')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Éditeur seul (Ctrl+1)"
          >
            📝 Éditeur
          </ViewButton>
          <ViewButton 
            active={viewMode === 'split'} 
            onClick={() => setViewMode('split')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Vue divisée (Ctrl+2)"
          >
            ⚏ Divisé
          </ViewButton>
          <ViewButton 
            active={viewMode === 'preview'} 
            onClick={() => setViewMode('preview')} 
            onMouseDown={(e) => e.preventDefault()}
            title="Aperçu seul (Ctrl+3)"
          >
            👁️ Aperçu
          </ViewButton>
        </ViewToggle>

        <AIAssistantToggle 
          isActive={showAIAssistant}
          onClick={() => setShowAIAssistant(!showAIAssistant)} 
          onMouseDown={(e) => e.preventDefault()}
          title="Assistant IA - Gemini"
        >
          <AIIcon>🤖</AIIcon>
          IA
        </AIAssistantToggle>

        <ToolbarButton 
          theme={theme} 
          onClick={() => setShowSettings(!showSettings)} 
          onMouseDown={(e) => e.preventDefault()}
          title="Paramètres"
        >
          ⚙️
        </ToolbarButton>

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
            onSelect={handleTextSelection}
            onMouseUp={handleTextSelection}
            onKeyUp={handleTextSelection}
            onBlur={(e) => {
              // Vérification de sécurité : si le contenu est vide par erreur, restaurer depuis localStorage
              if (!e.target.value && file.content) {
                const backup = loadFromLocalStorage();
                if (backup && backup.content) {
                  setFile(prev => ({ ...prev, content: backup.content }));
                }
              }
            }}
            onFocus={() => {
              // S'assurer que le contenu est synchronisé au focus
              if (textareaRef.current && textareaRef.current.value !== file.content) {
                textareaRef.current.value = file.content;
              }
            }}
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

      {/* Assistant IA */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        selectedText={selectedText}
        fullContent={file.content}
        onTextReplace={handleAITextReplace}
        onTextInsert={handleAITextInsert}
      />
    </div>
  );
};

export default MarkdownEditor;
