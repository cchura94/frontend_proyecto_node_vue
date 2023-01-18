<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Admin',
        items: [
            { label: 'ADMINISTRADOR', icon: 'pi pi-fw pi-home', to: '/admin' },
            { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/admin/perfil' }
        ],
    },
    {
        label: 'GESTION Productos',
        items: [
            { label: 'Categoria', icon: 'pi pi-fw pi-id-card', to: '/admin/categoria' },
            { label: 'Producto', icon: 'pi pi-fw pi-products', to: '/admin/producto' },
            
        ]
    },
    {
        label: 'Pedidos',
        items: [
            { label: 'Cliente', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: 'NEW' },
            { label: 'Nuevo Pedido', icon: 'pi pi-fw pi-globe', to: '/admin/pedido/nuevo' },
            { label: 'Lista Pedidos', icon: 'pi pi-fw pi-globe', to: '/admin/pedido' }
        ]
    },
    {
        label: 'Usuarios',
        items: [
            { label: 'Usuarios', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
            { label: 'Nuevo Usuario', icon: 'pi pi-fw pi-desktop', url: 'https://www.primefaces.org/primeflex/', target: '_blank' }
        ]
    },
    
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
