<template>
<Toast />
<div>
  <div class="card">
    <Toolbar class="mb-4">
        <template #start>
            <Button label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
            <Button label="Eliminar" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
        </template>

        <template #end>
            <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Importar" class="mr-2 inline-block" />
            <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
        </template>
    </Toolbar>

    <DataTable ref="dt" :value="products" :lazy="true" v-model:selection="selectedProducts" dataKey="id" 
                :paginator="true" :rows="10" :filters="filters" :totalRecords="totalRecords" :loading="loading" @page="onPage($event)"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
                <template #header>
                    <div class="table-header flex flex-column md:flex-row md:justiify-content-between">
						<h5 class="mb-2 md:m-0 p-as-md-center">Gestión Productos</h5>
						<span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                        </span>
					</div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="ID" :sortable="true" style="min-width:2rem"></Column>
                <Column field="nombre" header="NOMBRE" :sortable="true" style="min-width:8rem"></Column>
                <Column header="Image">
                     <template #body="slotProps">
                        <img :src="`http://127.0.0.1:3000/imagenes/${slotProps.data.imagen}`" :alt="slotProps.data.imagen" class="product-image" />
                    </template>
                </Column>
                <Column field="price" header="Precio" :sortable="true" style="min-width:4rem">
                    <template #body="slotProps">
                        {{formatCurrency(slotProps.data.precio)}}
                    </template>
                </Column>
                <Column field="Categorium.nombre" header="Categoria" :sortable="true" style="min-width:10rem"></Column>
                
                <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-image" @click="openModalImagen(slotProps.data)" />
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>

  </div>

<Dialog v-model:visible="productDialog" :style="{width: '450px'}" header="Detalles de Producto" :modal="true" class="p-fluid">
           
            <div class="field">
                <label for="nombre">Nombre</label>
                <InputText id="nombre" v-model.trim="product.nombre" required="true" autofocus :class="{'p-invalid': submitted && !product.nombre}" />
                <small class="p-error" v-if="submitted && !product.nombre">Nombre es Obligatorio.</small>
            </div>
            <div class="field">
                <label for="description">Descripcion</label>
                <Textarea id="description" v-model="product.descripcion" required="true" rows="3" cols="20" />
            </div>

           
            <div class="field">
                <label class="mb-3">Categoria</label>
                <div class="formgrid grid">
                    <div class="field-radiobutton col-6" v-for="cat in categorias" :key="cat.id">
                        <RadioButton id="category1" name="category" :value="cat.id" v-model="product.categoriaId" />
                        <label for="category1">{{ cat.nombre }}</label>
                    </div>
                </div>
            </div>

            <div class="formgrid grid">
                <div class="field col">
                    <label for="price">Precio</label>
                    <InputNumber id="price" v-model="product.precio" mode="currency" currency="USD" locale="en-US" />
                </div>
                <div class="field col">
                    <label for="quantity">Cantidad</label>
                    <InputNumber id="quantity" v-model="product.stock" integeronly />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{width: '450px'}" header="Confirmar Eliminación" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">¿Está seguro de eliminar el producto <b>{{product.nombre}}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false"/>
                <Button label="Si" icon="pi pi-check" class="p-button-text" @click="deleteProduct(product.id)" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false"/>
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
            </template>
        </Dialog>

        
        <Dialog header="Header" v-model:visible="displayModal" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}" :modal="true">
            <FileUpload :customUpload="true" @uploader="subirImagenServidor" :multiple="false" accept="image/*" :maxFileSize="1000000">
                
                <template #empty>
                    <p>Arrastrar imagenes aquí.</p>
                </template>
            </FileUpload>

           <template #footer>
                <Button label="Cerrar" icon="pi pi-times" @click="displayModal=false" class="p-button-text"/>
            </template>
        </Dialog>
  </div>
</template>

<script>
import productoService from "@/service/ProductoService.js"
import {ref, onMounted} from "vue"
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
// import ProductService from '@/service/ProductService';
import CategoriaService from '@/service/CategoriaService';

export default {

  setup() {
    const products = ref([]);
    const categorias = ref([]);
    const producto_id = ref(0);

const toast = useToast();
     const dt = ref();
     const displayModal = ref(false);
        const productDialog = ref(false);
        const deleteProductDialog = ref(false);
        const deleteProductsDialog = ref(false);
        const product = ref({});
        // const productService = ref(new ProductService());
        const selectedProducts = ref();
        const filters = ref({
            'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
        });
        const submitted = ref(false);
        const statuses = ref([
	     	{label: 'INSTOCK', value: 'instock'},
	     	{label: 'LOWSTOCK', value: 'lowstock'},
	     	{label: 'OUTOFSTOCK', value: 'outofstock'}
        ]);

        const loading = ref(false);
        const totalRecords = ref(0);
        const lazyParams = ref({});

        const formatCurrency = (value) => {
            if(value)
				return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
			return;
        };
        const openNew = () => {
            product.value = {};
            submitted.value = false;
            productDialog.value = true;
        };
        const openModalImagen = (prod) => {
            producto_id.value = prod.id
            displayModal.value = true;
        };
        const hideDialog = () => {
            productDialog.value = false;
            submitted.value = false;
        };
        const saveProduct = async () => {
            submitted.value = true;

			if (product.value.nombre.trim()) {
                if (product.value.id) {
                    /*
                    product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
                    products.value[findIndexById(product.value.id)] = product.value;
                    */
                   const {data} = await productoService.modificar(product.value.id, product.value)
                    listarProductos()
                    toast.add({severity:'success', summary: 'Successful', detail: 'Producto Actualizado', life: 3000});
                }
                else {
                    /*product.value.id = createId();
                    product.value.code = createId();
                    product.value.image = 'product-placeholder.svg';
                    product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
                    products.value.push(product.value);
                    */
                    const {data} = await productoService.guardar(product.value)
                    listarProductos()
                    toast.add({severity:'success', summary: 'Producto Registrado', detail: 'Se ha registrado el producto', life: 3000});
                }

                productDialog.value = false;
                product.value = {};
            }
        };
        const editProduct = (prod) => {
            product.value = {...prod};
            productDialog.value = true;
        };
        const confirmDeleteProduct = (prod) => {
            product.value = prod;
            deleteProductDialog.value = true;
        };
        const deleteProduct = async (id) => {
            /*
            products.value = products.value.filter(val => val.id !== product.value.id);
            */
           const {data} = await productoService.eliminar(id)
           deleteProductDialog.value = false;
           product.value = {};
           listarProductos();
            toast.add({severity:'success', summary: 'Successful', detail: 'Product Eliminado', life: 3000});
        };
        const findIndexById = (id) => {
            let index = -1;
            for (let i = 0; i < products.value.length; i++) {
                if (products.value[i].id === id) {
                    index = i;
                    break;
                }
            }

            return index;
        };
        const createId = () => {
            let id = '';
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for ( var i = 0; i < 5; i++ ) {
                id += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return id;
        }
        const exportCSV = () => {
            dt.value.exportCSV();
        };
        const confirmDeleteSelected = () => {
            deleteProductsDialog.value = true;
        };
        const deleteSelectedProducts = () => {
            products.value = products.value.filter(val => !selectedProducts.value.includes(val));
            deleteProductsDialog.value = false;
            selectedProducts.value = null;
            toast.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
        };

        const onPage = (event) => {
            lazyParams.value = event;

            listarProductos();
        };

    onMounted(async () => {

        loading.value = true;

            lazyParams.value = {
                first: 0,
                rows: dt.value.rows,
                sortField: null,
                sortOrder: null,
                filters: filters.value
            };

      listarProductos()

      cargarCategorias()
    })

    const listarProductos = async () => {
      try {
        loading.value = true;
        
        const {data} = await productoService.listar(lazyParams.value.page?lazyParams.value.page + 1:1, lazyParams.value.rows);
        products.value = data.rows;
        totalRecords.value = data.count
        
        loading.value = false;
        
      } catch (error) {
        console.log("Error: ", error);
      }
    }

    const cargarCategorias = async () => {
        try {
            const {data} = await CategoriaService.listarCategoria();
            categorias.value = data
            
        } catch (error) {
                        
        }

    }

    const subirImagenServidor = async (event) => {
        
        try {
            console.log(event.files)
            let formData = new FormData();
            formData.append("imagen", event.files[0]);

            await productoService.actualizarImagen(producto_id.value, formData);
        
            displayModal.value = false
            listarProductos()
        } catch (error) {
            console.log(error)    
        }

    }

   return { dt, products, categorias, productDialog, deleteProductDialog, deleteProductsDialog, product, totalRecords, loading, onPage,
            selectedProducts, filters, submitted, statuses, formatCurrency, openNew, hideDialog, saveProduct, editProduct, subirImagenServidor,
            confirmDeleteProduct, deleteProduct, findIndexById, createId, exportCSV, confirmDeleteSelected, deleteSelectedProducts, openModalImagen, displayModal}
    
  }

}
</script>

<style lang="scss" scoped>
.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 960px) {
        align-items: start;
	}
}

.product-image {
    width: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
    width: 50px;
    margin: 0 auto 2rem auto;
    display: block;
}

.confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
}
@media screen and (max-width: 960px) {
	::v-deep(.p-toolbar) {
		flex-wrap: wrap;
        
		.p-button {
            margin-bottom: 0.25rem;
        }
	}
}
</style>