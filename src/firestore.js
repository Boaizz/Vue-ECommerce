import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { ref, onUnmounted, computed } from 'vue';
import { app, auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firestore = getFirestore(app);
const messagesCollection = collection(firestore, 'messages database');
const messagesQuery = query(messagesCollection, orderBy('createdAt', 'desc'), limit(100));

export function useAuth() {
  const user = ref(null);

  const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user));
  onUnmounted(unsubscribe);
  
  const isLogin = computed(() => user.value !== null);

  const signIn = async () => {
    const googleProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, googleProvider);
  };

  const signOut = () => auth.signOut();

  return { user, isLogin, signIn, signOut };
}

export function useChat() {
  const { user, isLogin } = useAuth();
  const messages = ref([]);

  const unsubscribe = onSnapshot(messagesQuery, snapshot => {
    messages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();
  });
  onUnmounted(unsubscribe);

  const sendMessage = text => {
    if (!isLogin.value) return;
    const { photoURL, uid, displayName } = user.value;
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