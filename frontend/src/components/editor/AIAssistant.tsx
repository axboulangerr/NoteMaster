import React, { useState, useRef, useEffect } from 'react';
import geminiService from '../../services/geminiService';
import {
  AIAssistantContainer,
  AIAssistantHeader,
  AIAssistantTitle,
  AIAssistantCloseButton,
  AIAssistantBody,
  APIKeySection,
  APIKeyInput,
  APIKeyButton,
  APIKeyStatus,
  PromptSection,
  PromptTextarea,
  PromptActions,
  PromptButton,
  QuickActionsSection,
  QuickActionButton,
  SelectedTextSection,
  SelectedTextLabel,
  SelectedTextContent,
  LoadingSpinner,
  ErrorMessage,
  SuccessMessage
} from './AIAssistantStyles';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  fullContent: string;
  onTextReplace: (newText: string) => void;
  onTextInsert: (text: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  isOpen,
  onClose,
  selectedText,
  fullContent,
  onTextReplace,
  onTextInsert
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const promptRef = useRef<HTMLTextAreaElement>(null);

  // Charger la clé API depuis localStorage au montage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      try {
        geminiService.initialize(savedApiKey);
        setIsApiKeySet(true);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
      }
    }
  }, []);

  // Focus sur le textarea quand l'assistant s'ouvre
  useEffect(() => {
    if (isOpen && isApiKeySet && promptRef.current) {
      promptRef.current.focus();
    }
  }, [isOpen, isApiKeySet]);

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      setError('Veuillez entrer une clé API');
      return;
    }

    try {
      geminiService.initialize(apiKey.trim());
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setIsApiKeySet(true);
      setError('');
      setSuccess('Clé API configurée avec succès !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setIsApiKeySet(false);
    setSuccess('Clé API supprimée');
    setTimeout(() => setSuccess(''), 3000);
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const executeRequest = async (requestPrompt: string) => {
    if (!isApiKeySet) {
      setError('Veuillez d\'abord configurer votre clé API Gemini');
      return;
    }

    if (!requestPrompt.trim()) {
      setError('Veuillez entrer une demande');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await geminiService.processRequest(
        requestPrompt,
        selectedText || undefined,
        fullContent || undefined
      );

      if (selectedText) {
        // Remplacer le texte sélectionné
        onTextReplace(result);
        setSuccess('Texte modifié avec succès !');
      } else {
        // Insérer le nouveau texte
        onTextInsert(result);
        setSuccess('Contenu ajouté avec succès !');
      }
      
      setPrompt('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    executeRequest(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickActions = [
    {
      label: 'Corriger & Améliorer',
      action: () => executeRequest('Corrige la grammaire, l\'orthographe et améliore la clarté du texte'),
      disabled: !selectedText
    },
    {
      label: 'Résumer',
      action: () => executeRequest('Crée un résumé concis de ce texte'),
      disabled: !selectedText
    },
    {
      label: 'Développer',
      action: () => executeRequest('Développe et enrichis ce texte avec plus de détails'),
      disabled: !selectedText
    },
    {
      label: 'Traduire en anglais',
      action: () => executeRequest('Traduis ce texte en anglais'),
      disabled: !selectedText
    },
    {
      label: 'Ajouter des exemples',
      action: () => executeRequest('Ajoute des exemples concrets et pratiques'),
      disabled: !selectedText
    },
    {
      label: 'Créer un plan',
      action: () => executeRequest('Génère un plan structuré pour ce sujet')
    }
  ];

  if (!isOpen) return null;

  return (
    <AIAssistantContainer>
      <AIAssistantHeader>
        <AIAssistantTitle>🤖 Assistant IA - Gemini</AIAssistantTitle>
        <AIAssistantCloseButton onClick={onClose}>✕</AIAssistantCloseButton>
      </AIAssistantHeader>

      <AIAssistantBody>
        {!isApiKeySet ? (
          <APIKeySection>
            <h3>Configuration de l'API Gemini</h3>
            <p>Entrez votre clé API Google Gemini pour utiliser l'assistant IA :</p>
            <APIKeyInput
              type="password"
              placeholder="Votre clé API Gemini..."
              value={apiKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleApiKeySubmit()}
            />
            <APIKeyButton onClick={handleApiKeySubmit}>
              Configurer
            </APIKeyButton>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Votre clé sera stockée localement dans votre navigateur
            </p>
          </APIKeySection>
        ) : (
          <>
            <APIKeyStatus>
              ✅ API configurée 
              <APIKeyButton variant="remove" onClick={handleRemoveApiKey}>
                Supprimer
              </APIKeyButton>
            </APIKeyStatus>

            {selectedText && (
              <SelectedTextSection>
                <SelectedTextLabel>Texte sélectionné :</SelectedTextLabel>
                <SelectedTextContent>
                  {selectedText.substring(0, 200)}
                  {selectedText.length > 200 && '...'}
                </SelectedTextContent>
              </SelectedTextSection>
            )}

            <PromptSection>
              <PromptTextarea
                ref={promptRef}
                placeholder={selectedText 
                  ? "Que voulez-vous faire avec le texte sélectionné ? (Ctrl+Entrée pour exécuter)"
                  : "Que voulez-vous que l'IA génère ? (Ctrl+Entrée pour exécuter)"
                }
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={clearMessages}
                disabled={isLoading}
              />
              <PromptActions>
                <PromptButton 
                  onClick={handleSubmit}
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? 'Traitement...' : 'Exécuter'}
                </PromptButton>
              </PromptActions>
            </PromptSection>

            <QuickActionsSection>
              <h4>Actions rapides :</h4>
              <div>
                {quickActions.map((action, index) => (
                  <QuickActionButton
                    key={index}
                    onClick={action.action}
                    disabled={isLoading || action.disabled}
                    title={action.disabled ? 'Sélectionnez du texte pour cette action' : ''}
                  >
                    {action.label}
                  </QuickActionButton>
                ))}
              </div>
            </QuickActionsSection>
          </>
        )}

        {isLoading && (
          <LoadingSpinner>
            <div className="spinner"></div>
            Traitement en cours...
          </LoadingSpinner>
        )}

        {error && (
          <ErrorMessage>
            ❌ {error}
          </ErrorMessage>
        )}

        {success && (
          <SuccessMessage>
            ✅ {success}
          </SuccessMessage>
        )}
      </AIAssistantBody>
    </AIAssistantContainer>
  );
};

export default AIAssistant;
