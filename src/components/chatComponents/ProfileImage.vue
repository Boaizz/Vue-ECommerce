<template>
    <img class="user-image" :src="src" />
  </template>
  
  <script>
  export default {
    name: 'UserImage',
    props: { src: { type: String, default: '' } }  //url of profile image
  }
  </script>