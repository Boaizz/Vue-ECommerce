
/* eslint-disable */
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" style="font-size: 20px; font-weight: 700" href="/"> </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <b-navbar-nav class="navbar-nav ms-auto">
        <b-nav-item>
        <div class="nav_item">
            <router-link @click="openItemDesc()" to="#" data-bs-toggle="modal" data-bs-target="#bayModal"><font-awesome-icon icon="fa-solid fa-cart-shopping" /></router-link>
        </div>
        </b-nav-item>
        <b-nav-item>
          <button type="button" class="btn btn-success" @click="openModalFavorites">Show Favorites</button>
        </b-nav-item>
        <b-nav-item>
          <div>
            <div v-if="isLogin" class="login">
              <button class="btn btn-success" @click="signOut">Sign Out</button>
              <ProfileImage :src="user.photoURL" />
            </div>
            <button v-else class="btn btn-success" @click="signIn">Sign in</button>
          </div>
        </b-nav-item>
        
    </b-navbar-nav>
  </div>
</nav>
<b-modal v-model="modalFav" title="Favorite Items" size="lg" no-close-on-backdrop no-close-on-esc>
  <div v-if="favItems.length > 0" class="d-flex justify-content-center">
    <div class="d-flex flex-column align-items-center">
      <div class="col-12 px-0 px-md-2" v-for="(item, index) in favItems" :key="index">
        <div class="card">
          <img :src="item.images[0]" class="card-img-top mt-5" width="200" height="400" />
          <div class="card-body">
            <h5 class="card-title">{{ item.title }}</h5>
            <p class="card-text">{{ item.description }}</p>
            <a href="#" @click="removeFavoriteItem(item.id)" class="text-danger px-3 py-1"><font-awesome-icon icon="fa-solid fa-remove " /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="d-flex justify-content-center">
    <p>You have no favorite items.</p>
  </div>
</b-modal>

<b-modal  id="bayModal" v-model="modalShow" size="xl" hide-header hide-footer>
    <div class="card-body">
        <div class="alert alert-success" role="alert">
        SHOPPING CART
       
        <div class="table-responsive">
                <table class="table table-striped table-hover">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Unit Price</th>
                            <th>qty</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Total Price</th>
                            <th>Remove</th>
                        </tr>
                        <tr v-for="item, i in basketItems" :key="i">                                
                            <td>{{i + 1}}</td>
                            <td>{{item.title}}</td>
                            <td><img :src="item.images[0]" class="" width="80" height="90" /></td>
                            <td>{{ item.price }}</td>
                            <td>{{ item.qty }}</td>
                            <td>{{ item.price * item.qty }}</td>
                            <td>{{ parseFloat(item.price * item.qty * 0.15).toFixed(2) }}</td>
                            <td>{{ parseFloat(item.price * item.qty - item.price * item.qty * 0.15).toFixed(2) }}</td>
                            <td><a href="#" @click="removeCartItem(item.id)" class="text-danger px-3 py-1"><font-awesome-icon icon="fa-solid fa-remove " /></a></td>
                        </tr>                            
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="bold">Total</td>
                            <td class="bold">$ {{ getTotal()}} </td>
                            <td></td>
                        </tr>
                </table>
                <div class="my-4">
                    <button  @click.prevent="closeModalCart()" class="btn btn-danger float-start">Close</button>
                    <button  class="btn btn-success float-end">Proceed To Payment</button>
              </div>
                </div>
         </div>
      </div>
  </b-modal>

</template>
<script>
import { auth } from '../firebaseConfig'
import alert from 'sweetalert2'
import ProfileImage from '@/components/chatComponents/ProfileImage.vue'
import { useAuth } from '@/firestore'

export default {
  name: 'NavigationBar', 
  components: { ProfileImage },
  setup() {
  const { user, isLogin, signOut, signIn } = useAuth()

  const AlertSignIn = () => {
    signIn().then(() => {
      if (isLogin.value) {
        alert.fire({
          icon: 'success',
          title: `Hello, ${user.value.displayName}!`,
        });
      }
    })
  }
  
  return { user, isLogin, signOut, signIn: AlertSignIn }
},
  data() {
    return {
      favItems: [],
      modalFav: false,
      basketItems: [], // Array to store shopping cart items
      modalShow: false, // Flag to control the visibility of the shopping cart modal
    };
  },

  methods: {
    // Open the shopping cart modal
    openItemDesc() {
      this.modalShow = true;
    },

    // Open the shopping cart modal
    openModalCart() {
      this.modalShow = true;
    },

    // Close the shopping cart modal
    closeModalCart() {
      this.modalShow = false;
    },

    isLoggedIn() {
      const user = auth.currentUser;
      if (user) {
        alert.fire({
          icon: 'warning',
          title: 'You have Already Logged In',
        });
        this.$router.push('/user');
      }
    },

    // Load shopping cart items from session storage
    loadCartItem() {
      this.basketItems = sessionStorage.basketItems != undefined ? JSON.parse(sessionStorage.basketItems) : [];
    },

    // Remove a shopping cart item based on its ID
    removeCartItem(id) {
      this.basketItems = this.basketItems.filter(function (d) { return d.id != id; });
      sessionStorage.setItem('basketItems', JSON.stringify(this.basketItems));
      this.$store.commit('updateBasketCount', -1); // Update the basket count in the store
    },

    // Calculate the total price of the items in the shopping cart
    getTotal() {
      let total = 0;
      for (const item of this.basketItems) {
        total += item.price * item.qty;
      }
      return parseFloat(total).toFixed(2);
    },

    
  getFavoriteItems() {
    return sessionStorage.favItems != undefined ? JSON.parse(sessionStorage.favItems) : [];
  },

  removeFavoriteItem(id) {
    const items = this.getFavoriteItems();
    const updatedItems = items.filter((d) => d.id != id);
    sessionStorage.setItem('favItems', JSON.stringify(updatedItems));
  },
  
  openModalFavorites() {
    this.favItems = this.getFavoriteItems();
    this.modalFav = true;
  },
  
  },



  mounted() {
    // Load shopping cart items when the component is mounted
    this.loadCartItem();
  },
}
</script>
<style>

</style>