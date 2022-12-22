<template>
  <h1>Ingresar</h1>
  {{ usuario }}
  <br>
  <input type="email" v-model="usuario.email" placeholder="Ingrese Correo">
  <input type="password" v-model="usuario.password" placeholder="Ingrese Contraseña">
  <br>
  <button @click="ingresar">INGRESAR</button>
  <br>
  {{ jwt }}
  <p v-if="errores">{{ errores }}</p>
</template>

<script>
import authService from "@/service/AuthService.js"
import {ref} from "vue"

export default {
    setup(){
        const usuario = ref({email: "", password: ""})
        const jwt = ref({})
        const errores = ref(null)

        const ingresar = async () => {
            try{
                const {data} = await authService.login(usuario.value);
                jwt.value = data
            }catch(error){
                errores.value = error
            }
        }

        return {
            usuario,
            ingresar,
            jwt,
            errores
        }
    }

}
</script>

<style>

</style>