<template>
  <div class="card">
    <Toast />
        
        <DataTable :value="pedidos" v-model:expandedRows="expandedRows" dataKey="id"
            @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" responsiveLayout="scroll">
            <template #header>
                <div class="table-header-container">
                    <Button icon="pi pi-plus" label="Expand All" @click="expandAll" class="mr-2" />
                    <Button icon="pi pi-minus" label="Collapse All" @click="collapseAll" />
                </div>
            </template>
            <Column :expander="true" headerStyle="width: 3rem" />
            <Column field="id" header="ID" sortable></Column>
            <!--Column header="Image">
                <template #body="slotProps">
                    <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" :alt="slotProps.data.image" class="product-image" />
                </template>
            </Column-->
            <Column field="fecha" header="Fecha" sortable>
                <template #body="slotProps">
                    {{slotProps.data.fecha}}
                </template>
            </Column>
            <Column field="Cliente" header="CLIENTE">
                <template #body="slotProps">
                    <h5>{{slotProps.data.Cliente.nombre_completo}}</h5>
                    <h6>{{slotProps.data.Cliente.correo}} - {{slotProps.data.Cliente.telefono}}</h6>
                    
                </template>
            </Column>
            <Column field="estado" header="Estado" sortable>
                <template #body="slotProps">
                    <span :class="'product-badge status-' + slotProps.data.estado">{{slotProps.data.estado==1?'PROCESO':'COMPLETADO'}}</span>
                </template>
            </Column>
            <template #expansion="slotProps">
                <div class="orders-subtable">
                    <h5>Productos del Pedido {{slotProps.data.id}}</h5>
                    <DataTable :value="slotProps.data.Productos" responsiveLayout="scroll">
                        <Column field="id" header="Id" sortable></Column>
                        <Column field="nombre" header="Nombre" sortable></Column>
                        <Column field="date" header="Date" sortable></Column>
                        <Column field="precio" header="Precio" sortable>
                            <template #body="slotProps" sortable>
                                {{formatCurrency(slotProps.data.precio)}}
                            </template>
                        </Column>
                        <Column field="stock" header="Stock" sortable>
                            <template #body="slotProps">
                                <span :class="'order-badge order-' + slotProps.data.estado">{{slotProps.data.stock}}</span>
                            </template>
                        </Column>
                        <Column headerStyle="width:4rem">
                            <template #body>
                                <Button icon="pi pi-search" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
  </div>
</template>

<script>
import pedidoService from "@/service/PedidoService.js"
import { onMounted, ref } from 'vue'
export default {

    setup(){
        const pedidos = ref([])

        onMounted(() => {
            listaPedidos()
        })

        const listaPedidos= async () => {
            const {data}= await pedidoService.listar();
            pedidos.value = data.rows
        }

        const expandedRows = ref([]);

        const onRowExpand = (event) => {
            toast.add({severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000});
        };
        const onRowCollapse = (event) => {
            toast.add({severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000});
        };
        const expandAll = () => {
            expandedRows.value = products.value.filter(p => p.id);
            toast.add({severity: 'success', summary: 'All Rows Expanded', life: 3000});
        };
        const collapseAll = () => {
            expandedRows.value = null;
            toast.add({severity: 'success', summary: 'All Rows Collapsed', life: 3000});
        };
        const formatCurrency = (value) => {
            return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
        };

        return {pedidos, expandedRows, onRowExpand, onRowCollapse, expandAll, collapseAll, formatCurrency }

    }

}
</script>

<style>

</style>