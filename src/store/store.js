import { createStore } from 'vuex'
import { auth } from '@/firebaseConfig'
import {  signInWithEmailAndPassword, signOut} from 'firebase/auth'
const store = createStore({
    state() {
        return {
            //user data
            user: {
                data: null
            }, 
            // retrieve basket count
            basketCount: sessionStorage.basketItems != undefined ? JSON.parse(sessionStorage.basketItems).reduce((total, item) => total + item.qty, 0) : 0,
        }
    }, 
    getters: {
        // retrieve the user object from the state
        user(state) {
            return state.user
        }
    },
    mutations: {
        // initialize the user data in the state with the provided payload
        initUser(state, payload) {
            state.user.data = payload
        },
        // update the basket count by adding the provided value
        updateBasketCount(state, val) {
            state.basketCount += val
        },
        // reset the basket count to 0
        resetBasketCount(state) {
            state.basketCount = 0
        },
        // set the basket count to the provided count value
        setBasketCount(state, count) {
            state.basketCount = count;
        },
    },
    actions: {
       //log in the user using the provided email and password
        async logIn(context, { email, password }) {
            const response = await signInWithEmailAndPassword(auth, email, password)
            if (response) {
                context.commit('initUser', response.user)
            } else {
                throw new Error('login failed')
            }
        },
        //log out the user
        async logOut(context) {
            await signOut(auth)
            context.commit('initUser', null)
            context.commit('resetBasketCount');
        },

       
        //fetch the user information and initialize it in the state
        async fetchUser(context, user) {
            if (user) {
                context.commit("initUser", {
                        displayName: user.displayName,
                        email: user.email,
                        displayPhoto: user.photoURL,
                    },
                    console.log(user.photoURL));
            } else {
                context.commit("initUser", null); //set the init user back to null 
            }
        }
    }

})

export default store