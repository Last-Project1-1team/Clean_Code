<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import itemSearchVue from '@/components/ItemMasterSearch.vue';
import axios from 'axios';
// import { onBeforeMount, shallowRef, computed } from 'vue';
// import useDateUtils from '@/utils/useDates.js';

const itemStock = ref([]); // 모달에서 넘어온 데이터 저장
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const handleSubmit = ({ itemCode, itemName }) => {
    getInput(itemCode, itemName);
};

const getInput = async (itemcode, itemname) => {
    try {
        const result = await axios.get(`${apiUrl}/itemStock`, {
            params: {
                itemCode: itemcode || '',
                itemName: itemname || ''
            }
        });

        itemStock.value = result.data;
    } catch (err) {
        console.error('발주 조회 실패:', err);
        itemStock.value = [];
    }
};
const formatNumber = (val) => {
    if (val == null || val === '') return '-';
    return Number(val).toLocaleString();
};
const getGroupTotal = (itemCode) => {
    return itemStock.value.filter((item) => item.itemCode === itemCode).reduce((sum, item) => sum + (parseInt(item.stockQty) || 0), 0);
};
</script>

<template>
    <div class="card flex flex-col gap-4 relative">
        <itemSearchVue @submit="handleSubmit" />
        <DataTable :value="itemStock" rowGroupMode="subheader" groupRowsBy="itemCode" sortMode="single" sortField="itemCode" :sortOrder="1" scrollHeight="70vh" tableStyle="min-width: 60rem">
            <template #groupheader="slotProps"
                ><div class="flex font-semibold w-full pr-4 py-2 text-gray-700">{{ slotProps.data.itemCode }} / 합계: {{ formatNumber(getGroupTotal(slotProps.data.itemCode)) }}</div>
            </template>
            <Column field="itemName" header="자재명" style="min-width: 10em" />
            <Column field="spec" header="규격" style="min-width: 8em" />
            <Column field="unit" header="단위" style="min-width: 5em; text-align: center" />
            <Column field="stock" header="창고" style="min-width: 5em; text-align: center" />
            <Column field="stockQty" header="수량" style="min-width: 6em; text-align: right">
                <template #body="{ data }">{{ formatNumber(data.stockQty) }}</template>
            </Column>
        </DataTable>
    </div>
    <!-- </div> -->
</template>
