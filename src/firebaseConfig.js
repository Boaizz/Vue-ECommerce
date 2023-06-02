import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';


//firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzLqV7tVs8IOOelRBWOC-7_0j0aFfBOSY",
    authDomain: "vue-social-app-bdd5d.firebaseapp.com",
    projectId: "vue-social-app-bdd5d",
    storageBucket: "vue-social-app-bdd5d.appspot.com",
    messagingSenderId: "290322702669",
    appId: "1:290322702669:web:661a65b977ce7d087c5704",
    measurementId: "G-26Q8VETMDN"
}

//init firebase app
const app = initializeApp(firebaseConfig);
//get authentication 
const auth = getAuth(app)


export { app, auth }
