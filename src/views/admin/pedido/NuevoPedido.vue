<template>
  <div class="grid">
    <div class="col-7">
        <div class="card">
            <h5>Lista Productos</h5>

        <DataTable :value="productos" responsiveLayout="scroll">
            <Column field="id" header="ID"></Column>
            <Column field="nombre" header="Nombre"></Column>
            <Column field="precio" header="Precio"></Column>
            <Column field="stock" header="Stock"></Column>
            <Column :exportable="false">
                <template #body="slotProps">
                    <Button icon="pi pi-plus" class="p-button-rounded p-button-success mr-2" @click="addCarrito(slotProps.data)" />
                   </template>
            </Column>
        </DataTable>
            
        </div>
    </div>
    <div class="col-5">
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <h5>Carrito</h5>
                    <!--{{ storeCarrito.carrito }}-->
                    <DataTable :value="carrito" responsiveLayout="scroll">
                        <Column field="nombre" header="Nombre"></Column>
                        <Column field="precio" header="Precio"></Column>
                        <Column field="cantidad" header="Cant"></Column>
                        <Column :exportable="false">
                            <template #body="slotProps">
                                <Button icon="pi pi-minus-circle" class="p-button-rounded p-button-danger mr-2" @click="quitarCarrito(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
            <div class="col-12">
                <div class="card">
                    <h5>Cliente</h5>
                    <div class="grid">
                        <div class="col-8">
                            <InputText type="text" v-model="buscar" @keyup="buscarCliente" />
                        </div>
                        <div class="col-4">
                            <Button label="Nuevo" icon="pi pi-external-link" @click="displayModal=true" />
        
                        </div>
                        <div class="col-12" v-if="cliente_seleccionado">
                            <h5>NOMBRE: {{ cliente_seleccionado.nombre_completo }}</h5>
                            <h5>CORREO: {{ cliente_seleccionado.correo }}</h5>
                            <h5>TELEFONO: {{ cliente_seleccionado.telefono }}</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="card">
                    <h5>Pedido</h5>
                    <h1>TOTAL: ${{ getTotal() }}</h1>
                    <Button label="Registrar Pedido" class="block" @click="registrarPedido" />
        
                </div>
            </div>
        </div>
    </div>
</div>

<Dialog header="Header" v-model:visible="displayModal" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}" :modal="true" class="p-fluid">
            <div class="field">
                <label for="name">Nombre Completo</label>
                <InputText id="name" v-model="cliente.nombre_completo" required="true" autofocus />
                
            </div>

            <div class="field">
                <label for="name">Telefono</label>
                <InputText id="name" v-model="cliente.telefono" autofocus />
                
            </div>
            <div class="field">
                <label for="name">Correo</label>
                <InputText id="name" v-model="cliente.correo" autofocus />
            </div>


            <template #footer>
                <Button label="Cerrar" icon="pi pi-times" @click="displayModal=false" class="p-button-text"/>
                <Button label="Guardar" icon="pi pi-check" @click="guardarCliente" autofocus />
            </template>
        </Dialog>
</template>

<script>
import productoService from "@/service/ProductoService.js"
import clienteService from "@/service/ClienteService.js"
import pedidoService from "@/service/PedidoService.js"
import {ref, onMounted} from "vue"
import { useRouter, useRoute } from 'vue-router'
import { useCarritoStore } from '@/stores/carrito'


export default {

    setup(){
        const productos = ref([])
        const carrito = ref([])
        const displayModal = ref(false)
        const cliente = ref({nombre_completo: '', telefono: '', correo: ''})
        const cliente_seleccionado = ref(null)

        const buscar = ref('');
        const router = useRouter()

        const storeCarrito = useCarritoStore()

        onMounted(() => {
            listarProductos();
            carrito.value = storeCarrito.carrito
            cliente_seleccionado.value = storeCarrito.cliente_seleccionado
        })

        const listarProductos = async ()=>{
            try {
                const {data} = await productoService.listar()
                productos.value = data.rows
                
            } catch (error) {
                console.log(error);
                
            }
        }

        const buscarCliente = async () => {
            if(buscar.value != ""){
                const {data} = await clienteService.listar(buscar.value)
                console.log(data)
                cliente_seleccionado.value = data.length>0?data[0]:null
                storeCarrito.cliente_seleccionado = cliente_seleccionado.value
            }else{
                cliente_seleccionado.value = null
                storeCarrito.cliente_seleccionado = null
            }
        }

        const addCarrito = (prod) => {
            let pos = -1
            for (let i = 0; i < carrito.value.length; i++) {
                const pr = carrito.value[i];
                if(pr.id == prod.id){
                    pos = i
                }          
            }
            if(pos>=0){
                carrito.value[pos].cantidad++;
                prod.stock--;
            }else{

                // carrito.value.push({id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1});
                prod.stock--;
                storeCarrito.agregarCarrito({id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1})
            }

        }

        const quitarCarrito = (prod) => {
            let pos = -1
            for (let i = 0; i < carrito.value.length; i++) {
                const pr = carrito.value[i];
                if(pr.id == prod.id){
                    pos = i
                }                
            }
            if(pos>=0){
                // const producto = productos.value.filter(p => p.id === carrito.value[pos].id);
                
                productos.value.forEach(function(producto) {
                    if (producto.id === carrito.value[pos].id) {
                        producto.stock = producto.stock + carrito.value[pos].cantidad
                    }
                });
                // prod.stock += carrito.value[pos].cantidad
                carrito.value.splice(pos, 1);
            }
        }

        const guardarCliente = async () => {
            const {data} = await clienteService.guardar(cliente.value)

            console.log(data)

            cliente_seleccionado.value = data.data
            storeCarrito.cliente_seleccionado = cliente_seleccionado.value
        }

        const getTotal = () =>{
            let st = 0;
            carrito.value.forEach(prod => {
                st += parseFloat(prod.precio) * parseFloat(prod.cantidad);
            })

            return st.toFixed(2);
        }

        const registrarPedido = async () => {
            let prods = []

            carrito.value.forEach(prod => {
                prods.push({producto_id: prod.id, cantidad: prod.cantidad})
            })

            let pedido = {
                nro_fact: 0,
                clienteId: cliente_seleccionado.value.id,
                carrito: prods
            }

            await pedidoService.guardar(pedido)

            storeCarrito.cliente_seleccionado = null
            storeCarrito.carrito = []

             router.push({
                name: 'ListaPedido',
                /*query: {
                ...route.query,
                ...query,
                },*/
            })


        }

        return {
            productos,
            carrito,
            addCarrito,
            quitarCarrito,
            displayModal,
            cliente,
            cliente_seleccionado,
            getTotal,
            buscar,
            buscarCliente,
            guardarCliente,
            registrarPedido,
            storeCarrito
        }
    }

}
</script>
