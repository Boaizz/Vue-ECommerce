import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import "bootstrap"
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import store from './store/store.js'
import { BootstrapVue3 } from 'bootstrap-vue-3'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faThumbsUp, faPaperPlane,faCircleUser,faCartPlus ,faRightToBracket,faHeartCirclePlus, faHeart, faHome, faCartShopping , faSearch , faBagShopping, faRemove, faInfoCircle, faMessage } from '@fortawesome/free-solid-svg-icons';
import router from './router'
library.add( faThumbsUp, faPaperPlane,faHeartCirclePlus,faHeart,faHome, faInfoCircle, faSearch, faRemove, faCartShopping, faCircleUser,faCartPlus, faBagShopping, faFacebook,faRightToBracket, faMessage)

const app = createApp(App)
app.use(router)
app.use(store)
app.use(BootstrapVue3)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app');