<template>
<div>
    <h1>Registro</h1>
    {{ usuario }}
    <input type="text" placeholder="Nombre" v-model="usuario.nombre">
    <input type="text" placeholder="Apellidos" v-model="usuario.apellidos">
    <input type="email" placeholder="Email" v-model="usuario.email">
    <input type="password" placeholder="Contraseña" v-model="usuario.password">
    <input type="button" value="Registrarse" @click="registrarse">

</div>

<MiCarrito />

<h1>{{ store.contador }}</h1>
    <button @click="store.incrementar">+</button>
</template>

<script>
import { ref } from "vue"
import authService from "./../../service/AuthService"
import MiCarrito from "../../components/Carrito.vue"

import { useContadorStore } from '@/stores/contador'
export default {
    components: {
        MiCarrito
    },
    setup(){
        const usuario = ref({})
         const store = useContadorStore()

        const registrarse = async () => {
            const {data} = await authService.registroUsuario(usuario.value)
        }
        return {
            usuario,
            registrarse,
            store
            
        }
    }

}
</script>

<style>

</style>