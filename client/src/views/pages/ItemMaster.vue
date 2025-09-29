<script setup>
const itemMaster = ref([
    { itemCode: 'ITEM-1001', itemName: '자재명1', spec: '규격1-100ml', itemClassName: '화학', unitName: 'EA', lotPQty: 50 },
    { itemCode: 'ITEM-1002', itemName: '자재명2', spec: '규격2-200ml', itemClassName: '포장재', unitName: 'BOX', lotPQty: 30 },
    { itemCode: 'ITEM-1003', itemName: '자재명3', spec: '규격3-300ml', itemClassName: '원료', unitName: 'KG', lotPQty: 80 },
    { itemCode: 'ITEM-1004', itemName: '자재명4', spec: '규격4-400ml', itemClassName: '전자부품', unitName: 'SET', lotPQty: 20 },
    { itemCode: 'ITEM-1005', itemName: '자재명5', spec: '규격5-500ml', itemClassName: '기계', unitName: 'L', lotPQty: 15 }
]);
import ChartsExample from '@/views/uikit/ChartDoc.vue';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import ItemMasterSearchVue from '../../components/ItemMasterSearch.vue';
import ItemMasterTableVue from '../../components/ItemMasterTable.vue';
import ItemMasterInputVue from '../../components/ItemMasterInput.vue';
import VirtualScroller from 'primevue/virtualscroller';
onMounted(() => {
    ProductService.getProducts().then((data) => (products.value = data));
});
const onRowSelect = (event) => {
    // toast.add({ severity: 'info', summary: 'Product Selected', detail: 'Name: ' + event.data.item_code, life: 3000 });
    const data = event.data;
    formData.value = { ...data };
};
const onRowUnselect = (event) => {
    toast.add({ severity: 'warn', summary: 'Product Unselected', detail: 'Name: ' + event.data.item_code, life: 3000 });
};
const onClearItem = (event) => {
    formData.value = '';
};
const toast = useToast();
const dt = ref();
const products = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const selectedAutoValue = ref(null);
const radioValue = ref(null);
const autoFilteredValue = ref([]);
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);
const formData = ref({
    itemCode: '',
    itemName: '',
    spec: '',
    itemClassName: '',
    unitName: '',
    lotPQty: ''
});
</script>
<template>
    <div class="card">
        <ItemMasterSearchVue />
        <DataTable
            v-model:selection="selectedProduct"
            :value="itemMaster"
            scrollable
            scrollHeight="40vh"
            class="custom-table"
            selectionMode="single"
            dataKey="itemCode"
            :metaKeySelection="true"
            @rowSelect="onRowSelect"
            @rowUnselect="onRowUnselect"
            style="height: 40vh; border: 1px solid #ddd"
        >
            <Column field="itemCode" header="자재코드" style="min-width: 150px" frozen />
            <Column field="itemName" header="자재명" style="min-width: 200px" />
            <Column field="spec" header="상세규격" style="min-width: 400px" />
            <Column field="itemClassName" header="자재분류" style="min-width: 100px" />
            <Column field="unitName" header="단위" style="min-width: 50px" />
            <Column field="lotPQty" header="LOT당 수량" style="min-width: 100px" />
        </DataTable>
        <div class="relative">
            <div class="card flex flex-col gap-1">
                <div class="grid grid-cols-10 gap-2">
                    <label for="itemCode" class="flex items-center">자재코드</label>
                    <div class="col-span-5"><InputText id="itemCode" type="text" class="w-full" v-model="formData.itemCode" /></div>
                </div>
                <div class="grid grid-cols-10 gap-2">
                    <label for="itemName" class="flex items-center">자재명</label>
                    <div class="col-span-7"><InputText id="itemName" type="text" class="w-full" v-model="formData.itemName" /></div>
                </div>
                <div class="grid grid-cols-10 gap-2">
                    <label for="spec" class="flex items-center">상세규격</label>
                    <div class="col-span-7"><InputText id="itemName" type="text" class="w-full" v-model="formData.spec" /></div>
                </div>
                <div class="grid grid-cols-10 gap-2">
                    <label for="spec" class="flex items-center">자재분류</label> <AutoComplete class="col-span-3" v-model="selectedAutoValue" :suggestions="autoFilteredValue" optionLabel="name" dropdown display="chip" />
                    <label for="unit" class="flex items-center">단위</label> <AutoComplete class="col-span-3" v-model="selectedAutoValue" :suggestions="autoFilteredValue" optionLabel="name" dropdown display="chip" />
                </div>
                <div class="grid grid-cols-10 gap-2">
                    <label for="lotPQty" class="flex items-center">LOT당수량</label>
                    <div class="col-span-3"><InputText id="lotPQty" type="text" class="w-full" v-model="formData.lotPQty" /></div>
                    <label for="eaPQty" class="flex items-center">EA단위수량</label>
                    <div class="col-span-3"><InputText id="eaPQty" type="text" class="w-full" /></div>
                </div>
                <div class="grid grid-cols-10 gap-2">
                    <label for="safetyStock" class="flex items-center">안전재고</label>
                    <div class="col-span-3"><InputText id="safetyStock" type="text" class="w-full" /></div>
                    <label for="eaPQty" class="flex items-center">사용여부</label>
                    <div class="col-span-3">
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex items-center">
                                <RadioButton id="useYnY" name="useYn" value="Y" v-model="radioValue" /> <label for="useYnY" class="leading-none ml-2 col-3">Y</label> <RadioButton id="useYnN" name="useYn" value="N" v-model="radioValue" />
                                <label for="useYnN" class="leading-none ml-2">N</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 버튼 영역 (absolute: 오른쪽 위 고정) -->
            <div id="button_" class="absolute top-0 right-0 flex gap-2">
                <Button label="초기화" class="p-button-outlined px-6 py-3 text-lg font-bold" v-on:click="onClearItem" />
                <Button label="저장" class="p-button-success px-6 py-3 text-lg font-bold" />
            </div>
        </div>
    </div>
</template>
<style>
:deep(.custom-table .p-datatable-tbody > tr > td) {
    font-size: 1rem !important;
    padding: 4px 8px;
}
#button_ {
    margin: 20px;
}
</style>
