// Validation des variables d'environnement requises au démarrage.
// Échoue tôt et clairement plutôt que de s'appuyer sur des fallbacks en dur.
const REQUIRED = ['JWT_SECRET', 'MONGO_URI'];

const validateEnv = () => {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(
      `Variables d'environnement manquantes : ${missing.join(', ')}. ` +
        'Voir .env.example.'
    );
    process.exit(1);
  }
};

export default validateEnv;
