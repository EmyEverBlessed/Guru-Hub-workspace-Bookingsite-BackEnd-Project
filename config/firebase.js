const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Path to your Firebase service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-project-id>.firebaseio.com" // Replace with your actual database URL
});

const db = admin.firestore();

module.exports = db;
