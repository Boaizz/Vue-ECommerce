import { createStore } from 'vuex'
import { auth } from '@/firebaseConfig'
import {  signInWithEmailAndPassword, signOut} from 'firebase/auth'

const store = createStore({
    state() {
        return {
            user: {
                data: null
            },
            basketCount: sessionStorage.basketItems != undefined ? JSON.parse(sessionStorage.basketItems).length : 0,
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
                context.commit('initUser', response.user)
            } else {
                throw new Error('login failed')
            }
        },

        async logOut(context) {
            await signOut(auth)
            context.commit('initUser', null)
            context.commit('resetBasketCount');
        },

        async fetchUser(context, user) {
            if (user) {
                context.commit("initUser", {
                        displayName: user.displayName,
                        email: user.email,
                        displayPhoto: user.photoURL,

                    },
                    console.log(user.photoURL));
                    const basketItems = sessionStorage.basketItems != undefined ? JSON.parse(sessionStorage.basketItems) : []
                    context.commit('updateBasketCount', basketItems.length - context.state.basketCount);
            } else {
                context.commit("initUser", null);
            }
        }
    }


})

export default store