
/* eslint-disable */
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" style="font-size: 20px; font-weight: 700" href="/"> </a>
    <button class="navbar-toggler" type="button">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <b-navbar-nav class="navbar-nav ms-auto">
          <b-nav-item>
            <div class="nav-item px-2 pt-2">
              <span class="badge rounded-pill bg-warning">{{ store.state.basketCount }}</span><font-awesome-icon icon="fa-solid fa-cart-shopping" @click="openModalCart()" style="color: #2caf3b;" ></font-awesome-icon>
            </div>
          </b-nav-item>
          <b-nav-item>
            <div class="nav-item px-2 pt-2">
              <font-awesome-icon icon="heart" style="color: #2caf3b;"  @click="openModalFavorites"></font-awesome-icon>
            </div>
          </b-nav-item>
          <b-nav-item>
              <div v-if="isLogin" class="login px-2 pt-2">
                <RouterLink to="/user"><ProfileImage :src="user.photoURL" to="/"/></RouterLink>
              </div>
              <div v-else class="login px-2 pt-2">
                <font-awesome-icon icon="right-to-bracket" style="color: #2caf3b;"  @click="signIn"></font-awesome-icon>
              </div>
              </b-nav-item>
      </b-navbar-nav>
    </div>
  </nav>
  <b-modal v-model="modalFav" title="Favorite Items" size="s" no-close-on-backdrop no-close-on-esc>
    <div v-if="favItems.length > 0" class="d-flex justify-content-center">
      <div class="d-flex flex-column align-items-center">
        <div class="col-12 px-0 px-md-2" v-for="(item, index) in favItems" :key="index">
          <div class="card">
            <img :src="item.images[0]" class="card-img-top mt-5" width="200" height="400" />
            <div class="card-body">
              <h5 class="card-title">{{ item.title }}</h5>
              <p class="card-text">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  <div v-else class="d-flex justify-content-center">
    <p>You have no favorite items.</p>
  </div>
  </b-modal>

    <b-modal  id="bayModal" v-model="modalShow" size="xl" hide-header hide-footer no-close-on-backdrop no-close-on-esc>
          <div class="alert alert-success" role="alert">
            YOUR CART
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Remove</th>
                </tr>
                <tr v-for="item, i in basketItems" :key="i">                                
                  <td>{{i + 1}}</td>
                  <td>{{item.title}}</td>
                  <td><img :src="item.images[0]" class="" width="80" height="90" /></td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.qty }}</td>
                  <td>${{ parseFloat(item.price * item.qty).toFixed(2) }}</td>
                  <td><a href="#" @click="removeCartItem(item.id)" class="text-danger px-3 py-1"><font-awesome-icon icon="fa-solid fa-remove " /></a></td>
                </tr>                            
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td><strong>{{ store.state.basketCount }}</strong></td>
                  <td><strong>${{ getTotal()}}</strong> </td>
                  <td></td>
                </tr>
              </table>
              <div class="my-4">
                <button  @click.prevent="closeModalCart()" class="btn btn-danger float-start">Close</button>
                <button  class="btn btn-success float-end">Proceed To Payment</button>
              </div>
            </div>
          </div>
    </b-modal>

</template>
<script>
// import { computed } from 'vue';
import { useStore } from 'vuex';
import alert from 'sweetalert2';
import ProfileImage from '@/components/chatComponents/ProfileImage.vue';
import { useAuth } from '@/firestore';
export default {
  name: 'NavigationBar', 
  components: { ProfileImage },
  setup() {
  const store = useStore();
  const { user, isLogin, signOut, signIn } = useAuth()
  //trigger the sweet alert when user successfully login
  const AlertSignIn = () => {
  signIn().then(() => {
    if (isLogin.value) {
      alert.fire({
        icon: 'success',
        title: `Hello, ${user.value.displayName}!`,
      }); 
      
      const basketItems = sessionStorage.basketItems != undefined ? JSON.parse(sessionStorage.basketItems) : []
      const totalQty = basketItems.reduce((total, item) => total + item.qty, 0)
      store.commit('updateBasketCount', totalQty); 
    } 
  })
}

  return { user, isLogin, signOut, signIn: AlertSignIn, store}
},
  data() {
    return {
      favItems: [],     // array to store fav items
      modalFav: false, // flag to control the visibility of the fav modal
      basketItems: [], // array to store shopping cart items
      modalShow: false, // flag to control the visibility of the shopping cart modal
    };
  },
  

  methods: {

    //open the shopping cart modal
    openModalCart() {
      if (!this.isLogin) {   //check if user is logged in
      alert.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You need to login to open the cart',
      })
      return; 
      }  //stop execution if user is not logged 
      this.basketItems = this.loadCartItem();
      this.modalShow = true;
    },

    //close the shopping cart modal
    closeModalCart() {
      this.modalShow = false;
    },
   
    // load shopping cart items from session storage
    loadCartItem(){
        return sessionStorage.basketItems != undefined? JSON.parse(sessionStorage.basketItems): []           
    },

    // remove a shopping cart item based on its ID
    removeCartItem(id) {
      const itemToRemove = this.basketItems.find(item => item.id === id);
      const qtyToRemove = itemToRemove ? itemToRemove.qty : 0;
      this.basketItems = this.basketItems.filter(item => item.id !== id);
      sessionStorage.setItem('basketItems', JSON.stringify(this.basketItems));
      this.store.commit('updateBasketCount', -qtyToRemove); // Update the basket count in the store
    },

    // calculate the total price of the items in the shopping cart
    getTotal(){            
            let total = 0
            for (const item of this.basketItems) {                
                total += item.price * item.qty               
            }
            return  parseFloat(total).toFixed(2)
        }, 

    //load favorite items from the local storage
    loadFavoriteItems() {
      return sessionStorage.favItems != undefined ? JSON.parse(sessionStorage.favItems) : [];
    },
    //remove the favorite modal
    removeFavoriteItem(id) {
      const items = this.loadFavoriteItems();
      const updatedItems = items.filter((d) => d.id != id);
      sessionStorage.setItem('favItems', JSON.stringify(updatedItems));
    },
    //open the favorite modal
    openModalFavorites() {
      if (!this.isLogin) {   // Check if user is logged in
      alert.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You need to login to open the favorite items',
      })
      return;
    }
      this.favItems = this.loadFavoriteItems();
      this.modalFav = true;
    },
    updateBasketOnLogin() {
        //check if there are any basket items in sessionStorage
        const basketItems = sessionStorage.basketItems !== undefined ? JSON.parse(sessionStorage.basketItems) : [];
        if (this.user && this.user.uid && basketItems.length > 0) {
            //update the basket for this user in Vuex store
            this.store.commit('setBasket', { userId: this.user.uid, basket: basketItems });
        }
    },
    
  },

  mounted() {
    // load shopping cart items when the component is mounted
    this.loadCartItem();
  },
}
</script>
<style>

</style>