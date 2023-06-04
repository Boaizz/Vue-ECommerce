import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { ref, onUnmounted, computed } from 'vue';
import { app, auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// init firestore instance
const firestore = getFirestore(app);
const messagesCollection = collection(firestore, 'messages'); // collection for firestore instance
const messagesQuery = query(messagesCollection, orderBy('createdAt', 'desc'), limit(100));  //query for firestore collection
//function to handle user authentication
export function useAuth() {
  const user = ref(null);

  const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user));  //subscribe to changes in the user's authentication state
  onUnmounted(unsubscribe);
  
  const isLogin = computed(() => user.value !== null);

  const signIn = async () => {
    const googleProvider = new GoogleAuthProvider();     //using Google Sign In
    await signInWithPopup(auth, googleProvider);
  };

  const signOut = () => auth.signOut();    //sign out

  return { user, isLogin, signIn, signOut };
}
//function to handle chat functionality
export function useChat() {
  const { user, isLogin } = useAuth();
  const messages = ref([]);
// subscribe to changes in messagesQuery and update messages array
  const unsubscribe = onSnapshot(messagesQuery, snapshot => {
    messages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();
  });
  onUnmounted(unsubscribe);
  //function to send message
  const sendMessage = text => {
    if (!isLogin.value) return;
    const { photoURL, uid, displayName } = user.value;
    // add new message to firestore collection
    addDoc(messagesCollection, {
      userName: displayName,
      userId: uid,
      userImageURL: photoURL,
      text: text,
      createdAt: serverTimestamp()
    });
  };

  return { messages, sendMessage };
}