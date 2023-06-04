/* eslint-disable */
<template>
 <div class="container-fluid shadow-sm">
  <div class="row mb-3">
    <div class="col-12 col-md-6 col-lg-8">
      <div class="d-flex justify-content-start">
        <input type="text" v-model='searchString' class="form-control mt-2" placeholder="Search">
        <button class="btn btn-outline-success mt-2" type="submit"><font-awesome-icon icon="fa fa-search text-secondary"/></button>
      </div>
    </div>
    <div class="col-12 col-md-6 col-lg-4 mt-2">
      <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    Sort By: {{ aCategory == '' ? 'All' : aCategory }}
                </button>
                <ul class="dropdown-menu">
                    <a class="dropdown-item active" href="#"  @click="updateCategory">All</a> 
                    <a v-for="category, index in categories" :key="index" class="dropdown-item" href="#" @click="updateCategory" >{{category}}</a>                     
                </ul>
            </div>
    </div>
    </div>
  </div>

 <div class="row justify-content-center" >
          <div class="card_items col-12 col-sm-6 col-md-4 col-lg-3 mb-4 px-2" v-for="item, index in slicedItems" :key="index" >              
                <div class="card" >
                  <div class="badge bg-warning position-absolute fav" style="">
                      <font-awesome-icon :icon="item.isFavorite ? 'fa-solid fa-heart' : 'fa-solid fa-heart-circle-plus'" :class="['badge', 'bg-warning', {'text-danger': item.isFavorite}]" @click="toggleFavorite(item)"   />
                  </div>
                      <div v-if="item.stock > 0" class="badge bg-success text-white position-absolute available" style="">Available</div>
                      <div v-if="!item.stock > 0" class="badge bg-danger text-white position-absolute out" style="">Out of Order</div>
                      <img  :src="item.images[0]" @click="openModalDesc(item.id)" data-bs-toggle="collapse" class="card-img-top mt-5" width="200" height="400"/>                        
                      <div class="card-body">
                        <h6 class="h6 card-title text-center bold">{{ item.title }}</h6>
                        <div class="d-flex row align-content-center">
                          <p class="h5 text-center text-danger rounded bold">{{ item.price }} $</p>
                        </div>
                        <div class="row justify-content-around">
                          <div class="col-auto">
                            <button type="button" class="btn btn-info">
                              Buy Now <font-awesome-icon icon="fa-solid fa-bag-shopping" />
                            </button>
                          </div>
                          <div class="col-auto">
                            <button v-if="item.stock > 0" type="button" class="btn btn-success" @click="addItem(item.id)">
                              Add Cart<font-awesome-icon icon="fa-solid fa-cart-plus" />
                            </button>
                            <button v-if="!item.stock > 0" type="button" disabled class="btn btn-danger" @click="successOrder">
                              Not Available
                            </button>
                          </div>
                        </div>
                      </div>          
              </div>
          </div>
          
          <b-modal v-model="modalDesc" title="Item Details" size="s" no-close-on-backdrop no-close-on-esc>
            <div class="d-flex justify-content-center">
              <div class="d-flex flex-column align-items-center">
                    <div class="col-12 px-0 px-md-2">
                      <div class=""  v-if="selectedItem">
                        <Carousel :items-to-show="1" v-model="currentSlide">
                          <Slide  v-for="(image, index) in selectedItem.images" :key="index">
                            <img  :src="image"  class="card-img-top mt-5">
                          </Slide>
                        </Carousel>
                        <Carousel
                          id="thumbnails"
                          :items-to-show="2"
                          :wrap-around="true"
                          v-model="currentSlide"
                          ref="carousel">
                          <Slide v-for="(image, index) in selectedItem.images" :key="index">
                            <img  :src="image" @click="slideTo(index + 1)" class="card-img-top mt-5"> 
                          </Slide>
                        </Carousel>
                      </div>
                    </div>
                    <ul v-if="selectedItem">
                      <li><strong>Description:</strong> {{ selectedItem.description }}</li>
                      <li><strong>Brand:</strong> {{ selectedItem.brand }}</li> 
                      <li><font-awesome-icon icon="thumbs-up" /><strong> Ratings: {{selectedItem.rating}}/5</strong>
                      <vSR v-model="selectedItem.rating" starSize="20" inactiveColor="#fff" :showControl="false" :disableClick="true"/> </li>                                                         
                    </ul>
              </div>
             </div>
          </b-modal>
    <div class="row justify-content-center"></div>
    <div class="d-flex justify-content-center">
      <pagination-3 v-model="page" :records="filteredData.length" :per-page="perPage"></pagination-3>
    </div>
  </div>

</template>
<script>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'
import { auth } from '@/firebaseConfig'
import alert from 'sweetalert2'
import vSR from "vue3-star-ratings";
import pagination3 from 'v-pagination-3';
export default{
  name: "HomePage",
  data() {
     return {
         modalFav: false,
         favItems: [],
         selectedItem: null,
         modalDesc : false,
         basketItems: [],
         basketCount: 0,          
         searchString: '', 
         datas: [],
         categories: [],
         aCategory: '',  
         page: 1,
         perPage: 8,
         currentSlide: 0
      }
  },
  mounted(){
      //load the data from json file
    const data = 'products.json';
    const fetchData = async () => {
      try {
        const res = await fetch(data);
        const d = await res.json();
        this.datas = d;
        this.categories = [...new Set(d.map((x) => x.category))];
        this.datas.forEach(item => {
        const favorites = this.getFavoriteItems();
        if (favorites.some(favItem => favItem.id === item.id)) {
          item.isFavorite = true;
        } else {
          item.isFavorite = false;
        }
      });
      }
      catch (err){
        console.error(err);
      }
  };

  fetchData();

  },
  methods:{
    //set the chosen slide value in the modal description
    slideTo(val) {
      this.currentSlide = val
      if (this.currentSlide === this.selectedItem.images.length) {
        this.currentSlide = 0;
      }
    },

    //open the modal for description of the item
    openModalDesc(id) {
      this.modalDesc = true
      for (var item of this.datas) {
            if (item.id == id){
      console.log(item.image);
      this.selectedItem = item;
      }}
    },
    //set the current slide value in the modal description
    pageChangeHandler(selectedPage) {
    this.currentPage = selectedPage
    },
    //swal of the successfully ordered items
    successOrder(){
      this.$store.commit('updateBasketCount',1)
      alert.fire({
        position: 'center',
                 icon: 'success',
                 title: 'Added To Basket',
                 text:   "Successfully",
                 showConfirmButton: false,
                 timer: 3000  
                })
    },
    //sort the items by the category
    updateCategory(e){
        this.aCategory = e.target.text == 'All' ? '' : e.target.text
    },
    //add Item to Basket
    addItem(id) {
      this.addItemToBasket(id);
    },
    async addItemToBasket(id) {
      const user = await auth.currentUser;
      if (user) {
        let items = this.getBasketItems();

        for (var item of this.datas) {
          if (item.id == id) {
            let found = false;
            for (let i = 0; i < items.length; i++) {
              if (items[i].id === id) {
                items[i].stock--;
                items[i].available = (items[i].stock > 0);

                console.log(items[i].stock,items[i].available);
                items[i].qty++;
                found = true;
                break;
              }
            }
            if (found === false) {
              item.qty = 1;
              item.available = (item.stock > 0);
              items.push(item);
            }
            sessionStorage.setItem('basketItems', JSON.stringify(items));
            this.successOrder();
          }
        }
      }
      else {
        alert.fire({
          icon: 'warning',
          title: 'Login required',
          text: 'You must be logged in to perform this action',
        });
      }
    },

    //get the data of the items from the local storage
    getBasketItems(){
      return sessionStorage.basketItems != undefined? JSON.parse(sessionStorage.basketItems): []
    },
    //remove the item from the basket
    removeBasketItem(id){
      this.basketItems = this.basketItems.filter((d) => d.id != id)            
      sessionStorage.setItem('basketItems', JSON.stringify(this.basketItems));
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber
    },
    async addFavoriteItem(id) {
      const user = await auth.currentUser;
      if (user) {
        let items = this.getFavoriteItems();
        
        for (var item of this.datas) {
          if (item.id == id) {
            let found = false;
            for (let i = 0; i < items.length; i++) {
              if (items[i].id === id) {
                found = true;
                break;
              }
            }
            if (found === false) {
              items.push(item);
            }

            sessionStorage.setItem('favItems', JSON.stringify(items));
          }
        }
      }
      else {
        alert.fire({
          icon: 'warning',
          title: 'Login required',
          text: 'You must be logged in to perform this action',
        });
      }
    },
    getFavoriteItems() {
      return sessionStorage.favItems != undefined ? JSON.parse(sessionStorage.favItems) : [];
    },
    //function to remove the favorite items from favorite array
    removeFavoriteItem(id) {
      this.favItems = this.getFavoriteItems();
      const updatedItems = this.favItems.filter((d) => d.id != id);
      sessionStorage.setItem('favItems', JSON.stringify(updatedItems));
    },
    //handle when clicking the favorite item button
    toggleFavorite(item) {
      item.isFavorite = !item.isFavorite;

      if (item.isFavorite) {
        this.addFavoriteItem(item.id);
      } else {
        this.removeFavoriteItem(item.id);
      }
    },
  },
  
  computed: {
    filteredData() {
        return this.datas.filter(item => item.title.toLowerCase().match(this.searchString.toLowerCase()) && item.category.toLowerCase().match(this.aCategory)
        )
    },
    slicedItems() {
      const startIndex = (this.page - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.filteredData.slice(startIndex, endIndex);
    },
  },
  components: {
        vSR,
        pagination3,
        Carousel,
        Slide
    },
}

</script>

<style>

.row {
   padding: 25px 25px;
    --bs-gutter-x: 0;
    --bs-gutter-y: 0;
    display: flex;
    flex-wrap: wrap;
}

.available, .out {
  top: 5px; right: 5px;
}

.fav {
  top: 5px; left: 5px;
}

</style>