import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private apiKey: string = '';

  // Initialiser le service avec la clé API
  initialize(apiKey: string) {
    if (!apiKey) {
      throw new Error('Clé API Gemini requise');
    }
    
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  // Vérifier si le service est initialisé
  isInitialized(): boolean {
    return this.genAI !== null && this.model !== null;
  }

  // Tester la validité d'une clé API avec une requête simple
  async testApiKey(apiKey: string): Promise<boolean> {
    try {
      const testGenAI = new GoogleGenerativeAI(apiKey);
      const testModel = testGenAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      // Test avec une requête très simple
      const result = await testModel.generateContent("Hello");
      const response = await result.response;
      const text = response.text();
      
      // Si on arrive ici sans erreur, la clé est valide
      return text.length > 0;
    } catch (error: any) {
      console.error('Erreur lors du test de la clé API:', error);
      return false;
    }
  }

  // Fonction principale pour traiter les demandes de l'utilisateur
  async processRequest(prompt: string, selectedText?: string, fullContent?: string): Promise<string> {
    if (!this.isInitialized()) {
      throw new Error('Service Gemini non initialisé. Veuillez fournir une clé API.');
    }

    try {
      let fullPrompt = this.buildPrompt(prompt, selectedText, fullContent);
      
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error: any) {
      console.error('Erreur lors de l\'appel à Gemini:', error);
      
      if (error.message?.includes('API_KEY_INVALID')) {
        throw new Error('Clé API Gemini invalide. Veuillez vérifier votre clé.');
      } else if (error.message?.includes('QUOTA_EXCEEDED')) {
        throw new Error('Quota API dépassé. Veuillez réessayer plus tard.');
      } else if (error.message?.includes('SAFETY')) {
        throw new Error('Contenu bloqué par les filtres de sécurité.');
      } else {
        throw new Error(`Erreur API Gemini: ${error.message || 'Erreur inconnue'}`);
      }
    }
  }

  // Construire le prompt selon le contexte
  private buildPrompt(userRequest: string, selectedText?: string, fullContent?: string): string {
    let prompt = `Tu es un assistant IA pour un éditeur de markdown. L'utilisateur a fait la demande suivante : "${userRequest}"

Instructions importantes :
- Réponds uniquement avec le contenu markdown modifié/généré
- Ne pas inclure d'explications supplémentaires
- Respecter le format markdown existant
- Garder le style et le ton cohérents`;

    if (selectedText) {
      prompt += `

Texte sélectionné à modifier :
\`\`\`
${selectedText}
\`\`\``;
    }

    if (fullContent && fullContent.trim()) {
      prompt += `

Contexte du document complet :
\`\`\`
${fullContent}
\`\`\``;
    }

    prompt += `

Génère seulement le contenu markdown demandé, sans explications additionnelles.`;

    return prompt;
  }

  // Fonctions prédéfinies pour des actions courantes
  async improveText(text: string): Promise<string> {
    return this.processRequest(
      "Améliore ce texte en corrigeant la grammaire, l'orthographe et en améliorant la clarté",
      text
    );
  }

  async summarizeText(text: string): Promise<string> {
    return this.processRequest(
      "Crée un résumé concis de ce texte en markdown",
      text
    );
  }

  async expandText(text: string): Promise<string> {
    return this.processRequest(
      "Développe et enrichis ce texte avec plus de détails et d'exemples",
      text
    );
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    return this.processRequest(
      `Traduis ce texte en ${targetLanguage} en gardant le format markdown`,
      text
    );
  }

  async generateOutline(topic: string): Promise<string> {
    return this.processRequest(
      `Génère un plan détaillé en markdown pour le sujet : ${topic}`
    );
  }

  async addCodeExamples(text: string, language?: string): Promise<string> {
    const languageText = language ? ` en ${language}` : '';
    return this.processRequest(
      `Ajoute des exemples de code pertinents${languageText} à ce contenu`,
      text
    );
  }
}

// Instance singleton
const geminiService = new GeminiService();

export default geminiService;
