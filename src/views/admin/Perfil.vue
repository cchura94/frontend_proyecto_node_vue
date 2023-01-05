<template>
<div class="card">
  <h1>Perfil</h1>
  {{ perfil }}

</div>
</template>

<script>
import authService from "@/service/AuthService.js"
import { onMounted, ref } from '@vue/runtime-core'

export default {

    setup(){
        
        const perfil = ref(null)
        onMounted(async () => {
            const {data} = await authService.perfil()
            perfil.value = data
        })
        return {
            perfil
        }
    }

}
</script>

<style>

</style>