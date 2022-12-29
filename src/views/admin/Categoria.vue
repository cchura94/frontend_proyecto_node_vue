<template>
  <h1>Categoria</h1>

  <label for="nombre">Nombre:</label><br>
  <input type="text" id="nombre" v-model="categoria.nombre"><br>

  <label for="detalle">Detalle:</label><br>
  <textarea id="detalle" rows="3" cols="30" v-model="categoria.detalle"></textarea><br>

  <input type="button" :value="(categoria.id)?'Modificar Categoria':'Guardar Categoria'" @click="guardarCategoria">
    <button @click="clearCategoria()">cancelar</button>

  <table border="1">
    <tr>
        <td>ID</td>
        <td>NOMBRE</td>
        <td>DETALLE</td>
        <td>ACCION</td>
    </tr>
    <tr v-for="cat in categorias" :key="cat.id">
        <td>{{ cat.id }}</td>
        <td>{{ cat.nombre }}</td>
        <td>{{ cat.detalle }}</td>
        <td>
            <button @click="editarCategoria(cat)">editar</button>  
            <button @click="eliminarCategoria(cat)">eliminar</button>          
        </td>
    </tr> 
  </table>
</template>

<script>
import categoriaService from "@/service/CategoriaService.js"
import {ref, onMounted} from "vue"

export default {
    setup(){
        const categorias = ref([])
        const categoria = ref({nombre: '', detalle: ''})

        onMounted(() => {
            listarCategorias()
        })

        const listarCategorias = async () => {
            const {data} = await categoriaService.listarCategoria()
            categorias.value = data

        }

        const guardarCategoria = async () => {
            if(categoria.value.id){
                // modificar
                const {data} = await categoriaService.modificarCategoria(categoria.value.id, categoria.value);
            }else{
                // guardar
                const {data} = await categoriaService.guardarCategoria(categoria.value);
            }
            listarCategorias()
            categoria.value = {nombre: '', detalle: ''}
        }

        const editarCategoria = (cat) => {
            categoria.value = cat
        }

        const eliminarCategoria = async (cat) => {
            if(confirm("¿Está seguro de eliminar la categoria?")){
                const {data} = await categoriaService.eliminarCategoria(cat.id);
            }

            listarCategorias()
        }

        const clearCategoria = () => {

            categoria.value = {nombre: '', detalle: ''}
        }

        return {
            categorias,
            categoria,
            guardarCategoria,
            editarCategoria,
            clearCategoria,
            eliminarCategoria
        }
    }

}
</script>

<style>

</style>