import { createStore } from 'vuex'
import { auth } from '../firebaseConfig'
import {  signInWithEmailAndPassword, signOut} from 'firebase/auth'
const store = createStore({
    state() {
        return {
            user: {
                loggedIn: false,
                data: null
            },
            basketCount: sessionStorage.basketItems != undefined ? JSON.parse(sessionStorage.basketItems).length : 0,
            favCount: sessionStorage.favItems != undefined ? JSON.parse(sessionStorage.favItems).length : 0,
        }
    },
    getters: {
        user(state) {
            return state.user
        }
    },
    mutations: {
        initUser(state, payload) {
            state.user.data = payload
        },
        setStateLogin(state, value) {
            state.user.loggedIn = value;
        },
        updateBasketCount(state, val) {
            state.basketCount += val
        },
        resetBasketCount(state) {
            state.basketCount = 0
        },
     

    },
    actions: {
       

        async logIn(context, { email, password }) {
            const response = await signInWithEmailAndPassword(auth, email, password)
            if (response) {
                context.commit('setStateLogin', true)
                context.commit('initUser', response.user)
                console.log(response.user.data);

            } else {
                throw new Error('login failed')
            }
        },

        async logOut(context) {
            await signOut(auth)
            context.commit('initUser', null)
            context.commit('setStateLogin', false)
            context.commit('resetBasketCount');
        },

        async fetchUser(context, user) {
            context.commit("setStateLogin", user !== null);
            if (user) {
                context.commit("initUser", {
                        displayName: user.displayName,
                        email: user.email,
                        displayPhoto: user.photoURL,

                    },
                    console.log(user.photoURL));
            } else {
                context.commit("initUser", null);
            }
        }
    }


})

export default store