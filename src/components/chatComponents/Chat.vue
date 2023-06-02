<template>
    <div class="container-fluid">
      <div class="mx-5">
        <Message
          v-for="{ id, text, userImageURL, userName, userId } in messages"
          :key="id"
          :name="userName"
          :photo-url="userImageURL"
          :sender="userId == user?.uid"
        >
          {{ text }}
        </Message>
      </div>
    </div>
  
    <div ref="bottom" class="mt-20" />
  
    <div class="bottom">
      <div class="container-sm">
        <form v-if="isLogin" @submit.prevent="send">
          <input v-model="message" placeholder="Message" required />
          <button type="submit">
            <font-awesome-icon icon="fa-solid fa-paper-plane" />
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
import { ref, watch, nextTick } from 'vue'
import { useAuth, useChat } from '@/firestore'
import Message from './Message.vue'

export default {
  name: 'ChatMessage',
  components: { Message },
  setup() {
    const { user, isLogin } = useAuth() // Accessing user authentication-related properties
    const { messages, sendMessage } = useChat() // Accessing chat-related properties

    const bottom = ref(null) // Reference to the bottom div for scrolling

    // Watch for changes in the messages array and scroll to the bottom of the chat window
    watch(
      messages,
      () => {
        nextTick(() => {
          bottom.value?.scrollIntoView({ behavior: 'smooth' })
        })
      },
      { deep: true }
    )
    const message = ref('') // Holds the value of the input field for sending messages
    const send = () => {
      sendMessage(message.value) // Send the message using the sendMessage function
      message.value = '' // Reset the message value to empty after sending
    }
    return { user, isLogin, messages, bottom, message, send } 
  }
}
</script>