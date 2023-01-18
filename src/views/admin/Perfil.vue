<template>
<div class="card">
  <h1>Perfil</h1>
  {{ perfil }}
{{ storeCarrito.carrito }}
</div>
</template>

<script>
import authService from "@/service/AuthService.js"
import { onMounted, ref } from '@vue/runtime-core'
import { useCarritoStore } from '@/stores/carrito'
export default {

    setup(){
         const storeCarrito = useCarritoStore()
        const perfil = ref(null)
        onMounted(async () => {
            const {data} = await authService.perfil()
            perfil.value = data
        })
        return {
            perfil, storeCarrito
        }
    }

}
</script>

<style>

</style>