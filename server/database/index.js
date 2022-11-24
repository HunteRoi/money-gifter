const { initializeApp } = require("firebase/app");
const { getFirestore, setDoc, doc, addDoc, collection } = require("firebase/firestore/lite");

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

class Database {
    #db;
    static #instance;

    constructor(config = firebaseConfig) {
        const app = initializeApp(config);
        this.#db = getFirestore(app);
    }

    async addPayment(paymentData) {
        const paymentsCollection = collection(this.#db, "payments");
        await addDoc(paymentsCollection, paymentData);
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new Database();
        }
        return this.#instance;
    }
}

module.exports = Database;
