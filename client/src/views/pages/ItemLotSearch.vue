<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import itemSearchVue from '@/components/ItemMasterSearch.vue';
import axios from 'axios';
// import { onBeforeMount, shallowRef, computed } from 'vue';
// import useDateUtils from '@/utils/useDates.js';

const itemLot = ref([]); // 모달에서 넘어온 데이터 저장
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const handleSubmit = ({ code, name }) => {
    getInput(itemCode, itemName);
};

const getInput = async (itemcode, itemname) => {
    try {
        const result = await axios.get(`${apiUrl}/itemLot`, {
            params: {
                itemCode: itemcode.value || '',
                itemName: itemname.value || ''
            }
        });

        itemLot.value = result.data;
    } catch (err) {
        console.error('LOT 조회 실패:', err);
        itemLot.value = [];
    }
};
const formatNumber = (val) => {
    if (val == null || val === '') return '-';
    return Number(val).toLocaleString();
};
</script>

<template>
    <div class="card flex flex-col gap-4 relative">
        <itemSearchVue @submit="handleSubmit" />
        <DataTable :value="itemLot" scrollHeight="70vh" tableStyle="min-width: 60rem">
            <Column field="lotNo" header="LOT 번호" style="min-width: 10em" />
            <Column field="itemCode" header="자재코드" style="min-width: 10em" />
            <Column field="itemName" header="자재명" style="min-width: 10em" />
            <Column field="spec" header="규격" style="min-width: 8em" />
            <Column field="unit" header="단위" style="min-width: 5em; text-align: center" />
            <Column field="stock" header="현재위치" style="min-width: 5em; text-align: center" />
            <Column field="stockQty" header="수량" style="min-width: 6em; text-align: right">
                <template #body="{ data }">{{ formatNumber(data.stockQty) }}</template>
            </Column>
        </DataTable>
    </div>
    <!-- </div> -->
</template>
