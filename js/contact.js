document.getElementById('contact-form').addEventListener('submit', function(e) {
    // Empêche la soumission le temps de debugger
    e.preventDefault();
    
    console.log('=== DEBUG FORMULAIRE ===');
    console.log('Formulaire intercepté !');
    
    // Affiche toutes les données du formulaire
    const formData = new FormData(this);
    console.log('Données du formulaire:');
    for (let [key, value] of formData.entries()) {
        console.log(`- ${key}: ${value}`);
    }
    
    // Vérifie spécifiquement le champ "subject"
    const subjectValue = formData.get('subject');
    const sujectValue = formData.get('suject'); // L'ancien nom avec faute
    console.log('Valeur de "subject":', subjectValue);
    console.log('Valeur de "suject":', sujectValue);
    
    // Maintenant soumet le formulaire pour de vrai
    console.log('Soumission réelle...');
    this.submit();
});