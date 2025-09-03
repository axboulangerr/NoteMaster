import geminiService from '../src/services/geminiService';

// Test script pour vérifier le service Gemini
async function testGeminiService() {
  console.log('🧪 Test du service Gemini...');
  
  // Test sans clé API
  try {
    console.log('❌ Test sans clé API (doit échouer):');
    await geminiService.processRequest('Test');
  } catch (error) {
    console.log('✅ Erreur attendue:', error.message);
  }
  
  // Test avec clé API factice
  try {
    console.log('\n🔑 Test avec clé API factice (doit échouer):');
    geminiService.initialize('fake-api-key');
    await geminiService.processRequest('Test');
  } catch (error) {
    console.log('✅ Erreur attendue:', error.message);
  }
  
  console.log('\n📝 Pour tester avec une vraie clé API:');
  console.log('1. Remplacez "YOUR_ACTUAL_API_KEY" par votre vraie clé');
  console.log('2. Décommentez les lignes de test ci-dessous');
  console.log('3. Exécutez: npm run test-gemini');
  
  // Décommentez et remplacez par votre vraie clé API pour tester
  /*
  const YOUR_ACTUAL_API_KEY = 'your-actual-gemini-api-key-here';
  
  try {
    console.log('\n✨ Test avec vraie clé API:');
    geminiService.initialize(YOUR_ACTUAL_API_KEY);
    
    const result = await geminiService.processRequest(
      'Écris une phrase simple en français pour tester l\'API'
    );
    
    console.log('✅ Résultat:', result);
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
  */
}

testGeminiService();
