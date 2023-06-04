<template>
    <h1>HAVE A QUESTION?</h1>
    <Chat/> <!--Use the chat components-->
</template>
  
  <script>
 
  import Chat from '@/components/chatComponents/Chat.vue'
  
  export default {
    name: 'ChatRoom',
    components: {  Chat }
  }
  </script>