<template>
    <div class="message">
      <div class="row">
        <span v-if="!sender" class="col-5">{{ name }}</span>
      </div>
      <div class="flex" :class="sender ? 'flex-row-reverse' : ''">  
        <ProfileImage class="mt-2" :src="photoUrl" />
        <div class="text" :class="sender ? 'bg-green-800' : 'bg-gray-700'">
          <slot />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ProfileImage from './ProfileImage.vue'
  export default {
    name: 'MessageBox',
    components: { ProfileImage },
    props: {
      name: { type: String, default: '' },   // declaring properties
      photoUrl: { type: String, default: '' },  //URL of user photo
      sender: { type: Boolean, default: false }  // check the sender 
    }
  }
  </script>