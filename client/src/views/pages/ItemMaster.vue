<script setup>
const itemMaster = ref([
    // { itemCode: 'ITEM-1001', itemName: '자재명1', spec: '규격1-100ml', itemClassName: '화학', unitName: 'EA', lotPQty: 50 },
    // { itemCode: 'ITEM-1002', itemName: '자재명2', spec: '규격2-200ml', itemClassName: '포장재', unitName: 'BOX', lotPQty: 30 },
    // { itemCode: 'ITEM-1003', itemName: '자재명3', spec: '규격3-300ml', itemClassName: '원료', unitName: 'KG', lotPQty: 80 },
    // { itemCode: 'ITEM-1004', itemName: '자재명4', spec: '규격4-400ml', itemClassName: '전자부품', unitName: 'SET', lotPQty: 20 },
    // { itemCode: 'ITEM-1005', itemName: '자재명5', spec: '규격5-500ml', itemClassName: '기계', unitName: 'L', lotPQty: 15, eaPQty: 20 }
]);
import ChartsExample from '@/views/uikit/ChartDoc.vue';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, shallowRef } from 'vue';
import ItemMasterSearchVue from '@/components/ItemMasterSearch.vue';
import VirtualScroller from 'primevue/virtualscroller';
import axios from 'axios';
import { useRouter } from 'vue-router';

onMounted(async () => {
    ProductService.getProducts().then((data) => (products.value = data));
    const classresult = await axios.get(`${apiUrl}/itemMaster/itemClass`);
    itemClasses.value = classresult.data;
    const unitresult = await axios.get(`${apiUrl}/itemMaster/unit`);
    units.value = unitresult.data;
});

const router = useRouter(); // root 컴포넌트에 등록된 라우터를 불러오는 함수

const code = ref('');
const name = ref('');
const itemClasses = ref([]);
const units = ref([]);
const toast = useToast();
const products = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProduct = ref();
const selectedAutoValue = ref(null);
const radioValue = ref(null);
const autoFilteredValue = ref([]);
const submitted = ref(false);
const selectedItemClass = ref(null);
const filteredItemClass = ref([]);
const selectedUnit = ref(null);
const filteredItemUnit = ref([]);

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const formData = ref({
    itemCode: '',
    itemName: '',
    spec: '',
    itemClass: '',
    unit: '',
    lotPQty: '',
    eaPQty: '',
    safetyStock: '',
    useYn: ''
});

const onRowSelect = (event) => {
    // toast.add({ severity: 'info', summary: 'Product Selected', detail: 'Name: ' + event.data.item_code, life: 3000 });
    const data = event.data;
    formData.value = {
        ...data,
        itemClass: { code: data.itemClass, name: data.itemClassName }, // ← 객체로 변환
        unit: { code: data.unit, name: data.unitName } // ← 객체로 변환
    };
};
const onClearItem = () => {
    formData.value = {
        itemCode: '',
        itemName: '',
        spec: '',
        itemClass: '',
        itemClassName: '',
        unit: '',
        unitName: '',
        lotPQty: '',
        eaPQty: '',
        safetyStock: '',
        useYn: ''
    };
    selectedItemClass.value = null;
    selectedUnit.value = null;
    radioValue.value = null;
};
const handleSubmit = (item) => {
    getItemList(item.code, item.name);
};

const getItemList = async (code, name) => {
    let result = await axios
        .get(`${apiUrl}/itemMaster?`, {
            params: {
                itemCode: code || '',
                itemName: name || ''
            }
        })
        .catch((err) => {
            console.error('아이템 조회 실패:', err);
            itemMaster.value = [];
        });
    itemMaster.value = result.data;
};
const searchclass = (event) => {
    const query = event.query.toLowerCase();
    filteredItemClass.value = itemClasses.value.filter((item) => item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query));
};

const searchunit = (event) => {
    const query = event.query.toLowerCase();
    filteredItemUnit.value = units.value.filter((unit) => unit.name.toLowerCase().includes(query) || unit.code.toLowerCase().includes(query));
};
const onSave = async () => {
    const payload = {
        item_code: formData.value.itemCode,
        item_name: formData.value.itemName,
        spec: formData.value.spec,
        item_class: formData.value.itemClass?.code || '', // CODE만
        unit: formData.value.unit?.code || '',
        lot_p_qty: formData.value.lotPQty,
        ea_p_qty: formData.value.eaPQty,
        safety_stock: formData.value.safetyStock,
        use_yn: formData.value.useYn
    };

    console.log('저장 payload:', payload);

    let result = await axios.post(`${apiUrl}/itemMaster`, payload).catch((err) => console.log(err));
    let addRes = result.data;
    if (addRes.isSuccessed) {
        toast.add({ severity: 'success', summary: '저장 성공', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: '저장 실패', life: 3000 });
    }
};
</script>
<template>
    <div class="card">
        <ItemMasterSearchVue @submit="handleSubmit" />
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
            style="height: 40vh; border: 1px solid #ddd"
        >
            <Column field="itemCode" header="자재코드" style="min-width: 150px" frozen />
            <Column field="itemName" header="자재명" style="min-width: 200px" />
            <Column field="spec" header="상세규격" style="min-width: 400px" />
            <Column field="itemClass" header="자재분류코드" style="min-width: 100px" :hidden="true" />
            <Column field="itemClassName" header="자재분류" style="min-width: 100px" />
            <Column field="unit" header="단위코드" style="min-width: 50px" :hidden="true" />
            <Column field="unitName" header="단위" style="min-width: 50px" />
            <Column field="lotPQty" header="LOT당 수량" style="min-width: 100px" />
            <Column field="eaPQty" header="EA단위수량" style="min-width: 100px" :hidden="true" />
            <Column field="safetyStock" header="안전재고" style="min-width: 100px" :hidden="true" />
            <Column field="useYn" header="사용여부" style="min-width: 100px" :hidden="true" />
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
                    <div class="col-span-7"><InputText id="spec" type="text" class="w-full" v-model="formData.spec" /></div>
                </div>
                <div class="grid grid-cols-10 gap-2">
                    <label for="itemClass" class="flex items-center">자재분류</label>
                    <AutoComplete class="col-span-3" v-model="formData.itemClass" :suggestions="filteredItemClass" @complete="searchclass" optionLabel="name" dropdown display="chip" />
                    <label for="unit" class="flex items-center">단위</label>
                    <AutoComplete class="col-span-3" v-model="formData.unit" :suggestions="filteredItemUnit" @complete="searchunit" optionLabel="name" dropdown display="chip" />
                </div>
                <div class="grid grid-cols-10 gap-2">
                    <label for="lotPQty" class="flex items-center">LOT당수량</label>
                    <div class="col-span-3"><InputText id="lotPQty" type="number" class="w-full" v-model="formData.lotPQty" /></div>
                    <label for="eaPQty" class="flex items-center">EA단위수량</label>
                    <div class="col-span-3"><InputText id="eaPQty" type="number" class="w-full" v-model="formData.eaPQty" /></div>
                </div>
                <div class="grid grid-cols-10 gap-2">
                    <label for="safetyStock" class="flex items-center">안전재고</label>
                    <div class="col-span-3"><InputText id="safetyStock" type="text" class="w-full" v-model="formData.safetyStock" /></div>
                    <label for="eaPQty" class="flex items-center">사용여부</label>
                    <div class="col-span-3">
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex items-center">
                                <RadioButton id="useYnY" value="Y" v-model="formData.useYn" />
                                <label for="useYnY" class="leading-none ml-2 col-3">Y</label>
                                <RadioButton id="useYnY" value="N" v-model="formData.useYn" />
                                <label for="useYnN" class="leading-none ml-2">N</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 버튼 영역 (absolute: 오른쪽 위 고정) -->
            <div id="button_" class="absolute top-0 right-0 flex gap-2">
                <Button label="초기화" class="p-button-outlined px-6 py-3 text-lg font-bold" v-on:click="onClearItem" />
                <Button label="저장" class="p-button-success px-6 py-3 text-lg font-bold" v-on:click="onSave" />
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
