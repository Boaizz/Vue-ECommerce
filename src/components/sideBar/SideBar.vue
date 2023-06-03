/* eslint-disable */

<template>
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <h1>
      <span v-if="collapsed">
        <div>E</div>
        <div>B</div>
      </span>
      <span v-else>EBoiz</span>
    </h1>

    <SidebarLink to="/"><font-awesome-icon icon="fa-solid fa-house" bounce /> Home</SidebarLink>
    <SidebarLink to="/user" @click="isLogin()"> <font-awesome-icon icon="fa-solid fa-circle-user" /> User</SidebarLink>
    <SidebarLink to="/about"><font-awesome-icon icon="fa-solid fa-circle-info" /> About</SidebarLink>
    <SidebarLink to="/chat"  @click="isLogin()"><font-awesome-icon icon="fa-solid fa-message" /> Chat</SidebarLink>


    <span
      class="collapse-icon"
      :class="{ 'rotate-90': collapsed }"
      @click="toggleSidebar"
    >
      Toggle
    </span>
  </div>
</template>
<script>
import { auth } from '@/firebaseConfig'
import alert from 'sweetalert2'
import SidebarLink from './SideBarLink'
import { collapsed, toggleSidebar, sidebarWidth } from './state'

export default {
  props: {},
  components: { SidebarLink },
  setup() {
    return { collapsed, toggleSidebar, sidebarWidth }
  }
  ,data() {
        return {         
            basketItems : [] ,  
            
            modalShow: false, 

        };
    },
    methods: {
        async isLogin(){
            const user = auth.currentUser;
            if (!user){
            await alert.fire({
                icon: 'warning',
                title: 'Login required',
                text: 'You must be logged in to access.',
                
            });
            this.$router.push('/');

            }
        },                 
    },
    mounted() {                 
    },
}
</script>


<style>
:root {
  --sidebar-bg-color: #2f855a;
  --sidebar-item-hover: #38a169;
  --sidebar-item-active: #276749;
}
</style>

<style scoped>
.sidebar {
  color: white;
  background-color: var(--sidebar-bg-color);

  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0.5em;

  transition: 0.3s ease;

  display: flex;
  flex-direction: column;
}

.sidebar h1 {
  height: 2.5em;
}

.collapse-icon {
  position: absolute;
  bottom: 0;
  padding: 0.75em;

  color: rgba(255, 255, 255, 0.7);

  transition: 0.2s linear;
}

</style>
