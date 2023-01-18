<template>
  <main>
    <!-- <TheWelcome />-->

    <Carrito></Carrito>

    <h1>{{ store }}</h1>
    <button @click="store.incrementar">+</button>
  </main>
</template>

<script>
import TheWelcome from '../components/TheWelcome.vue'
import Carrito from '../components/Carrito.vue'
import { useContadorStore } from '@/stores/contador'

export default {

  components: {
    Carrito
  },
  setup() {
    const store = useContadorStore()

    return {
      store
    }
  
  }

}


</script>
