<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import ItemMasterSearchSaveVue from './ItemMasterSearchSave.vue';

const emit = defineEmits(['register']);

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const items = ref([]);
const selectedItems = ref([]);
const keyword = ref('');
onMounted(async () => {
    getItemList('', '');
});

const registerItems = () => {
    // 부모로 선택된 데이터 전달
    emit('register', selectedItems.value);
};

const handleSubmit = (item) => {
    getItemList(item.code, item.name);
};
const handleToss = () => {
    registerItems();
};

const getItemList = async (code, name) => {
    let result = await axios
        .get(`${apiUrl}/outorderitem?`, {
            params: {
                itemCode: code || '',
                itemName: name || ''
            }
        })
        .catch((err) => {
            console.error('아이템 조회 실패:', err);
            items.value = [];
        });
    items.value = result.data;
};
</script>

<template>
    <div>
        <ItemMasterSearchSaveVue @submit="handleSubmit" @toss="handleToss" />
        <!-- <Toolbar class="mb-6">
            <template #start>
                <div class="grid grid-cols-12 gap-2">
                    <label for="itemCode" class="flex items-center">자재코드</label>
                    <div class="col-span-4">
                        <InputText id="itemCode" type="text" class="w-full" v-model="itemCode" />
                    </div>

                    <label for="itemName" class="flex items-center">자재명</label>
                    <div class="col-span-4">
                        <InputText id="itemName" type="text" class="w-full" v-model="itemName" />
                    </div>
                </div>
            </template>
            <template #end>
                <Button label="등록" class="p-button-success" @click="registerItems" />
                <Button label="조회" @click="searchItems" />
            </template>
        </Toolbar> -->

        <DataTable :value="items" v-model:selection="selectedItems" dataKey="itemCode" selectionMode="multiple" scrollable scrollHeight="40vh">
            <Column selectionMode="multiple" headerStyle="width: 3em" />
            <Column field="itemCode" style="width: 100px" header="자재코드" />
            <Column field="itemName" style="width: 150px" header="자재명" />
            <Column field="spec" style="width: 150px" header="규격" />
            <Column field="unit" style="width: 50px" header="단위" :hidden="true" />
            <Column field="unitName" style="width: 50px" header="단위" />
            <Column field="toalStockQty" style="width: 50px" header="총재고수량" />
            <Column field="itemStockQty" style="width: 50px" header="자재창고 재고" />
            <Column field="prodStockQty" style="width: 50px" header="현장재고" />
            <Column field="safetyStockQty" style="width: 50px" header="안전재고" />
            <Column field="prodPlanQty" style="width: 50px" header="생산계획 수량" />
            <Column field="outOrdQty" style="width: 50px" header="발주필요 수량" />
        </DataTable>
    </div>
</template>
