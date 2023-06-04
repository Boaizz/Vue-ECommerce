/* eslint-disable */
<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8">
        <div class="card">
          <div v-if="isLogin">
          <ProfileImage :src="user.data.displayPhoto" class="img-fluid" />
          <div class="card-header">Welcome, {{user.data.displayName}}</div>
          <div class="card-body">
            <div class="alert alert-success" role="alert">
            SHOPPING CART
            <div class="my-4">
                  <button  @click.prevent="signOut" class="btn btn-primary">Sign Out</button>
            </div>
            <div class="table-responsive">
                    <table class="table table-striped table-hover">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Image</th>
                                <th>Unit Price</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th></th>
                            </tr>
                            <tr v-for="item, i in basketItems" :key="i">                                
                                <td>{{i + 1}}</td>
                                <td>{{item.title}}</td>
                                <td><img :src="item.images[0]" class="" width="80" height="90" /></td>
                                <td>{{ item.price }}</td>
                                <td>{{ item.qty }}</td>
                                <td>{{ parseFloat(item.price * item.qty).toFixed(2) }}</td>
                                <td><a href="#" @click="removeCartItem(item.id)" class="text-danger px-3 py-1"><font-awesome-icon icon="fa-solid fa-remove " /></a></td>
                            </tr>                            
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td class="bold">Total</td>
                                <td class="bold">$ {{ getTotal()  }} </td>
                                <td></td>
                            </tr>
                    </table>
                    </div>
             </div>
          </div>
             
          </div>
            <div v-else class="alert alert-danger" role="alert">
              You are not logged in! 
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileImage from '@/components/chatComponents/ProfileImage.vue';
import { useStore} from "vuex";
import { useRouter } from "vue-router";
import {computed} from "vue";
import { auth } from '@/firebaseConfig';
import alert from 'sweetalert2';
import { useAuth } from '@/firestore';


export default {
  components: { ProfileImage },
  setup() {
  const store = useStore()
  const router = useRouter()
  const { isLogin } = useAuth()

  //listen for changes in the authentication state
  auth.onAuthStateChanged(user => {
    store.dispatch("fetchUser", user);
  });
  //computed property for accessing the user data from the store
  const user = computed(() => {
    return store.getters.user;
  });
  //function to handle the sign out process
  const signOut = () => {
        alert.fire({
        title: 'Are you sure?',
        text: 'Do you really want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'}).then(async (result) => { if (result.isConfirmed){
        await store.dispatch('logOut')
        router.push('/')
        }})
  }

    return {user,signOut, isLogin}
 },
 data() {
    return {
      basketItems: [],   
     
    };
  },
 methods: {
        //load the cart item from local storage
        loadCartItem(){
            this.basketItems = sessionStorage.basketItems != undefined? JSON.parse(sessionStorage.basketItems): []           
        },
        //function to remove item from cart
        removeCartItem(id){            
            this.basketItems = this.basketItems.filter(function(d) { return d.id != id; })            
            sessionStorage.setItem('basketItems', JSON.stringify(this.basketItems));
            this.$store.commit('updateBasketCount',-1)
        },

        //calculate the total price of the cart
        getTotal(){            
            let total = 0
            for (const item of this.basketItems) {                
                total += item.price * item.qty               
            }
            return  parseFloat(total).toFixed(2)
        },                
    },
    mounted() {
        this.loadCartItem()                     
    },
  
};
</script>