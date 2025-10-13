<script setup>
import axios from 'axios';
import Dialog from 'primevue/dialog';

import { onMounted, ref } from 'vue';
import CustSearchVue from './CustSearch.vue';

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const emit = defineEmits(['custreg']);
const custs = ref([]);
const selectcusts = ref([]);
const keyword = ref('');

onMounted(async () => {
    getCustList('', '');
});

const registerCusts = () => {
    // 부모로 선택된 데이터 전달
    emit('custreg', selectcusts.value);
};

const handleSubmit = (cust) => {
    getCustList(cust.code, cust.name);
};
const handleToss = () => {
    registerCusts();
};

const getCustList = async (code, name) => {
    let result = await axios
        .get(`${apiUrl}/outordercust?`, {
            params: {
                custCode: code || '',
                custName: name || ''
            }
        })
        .catch((err) => {
            console.error('아이템 조회 실패:', err);
            custs.value = [];
        });
    custs.value = result.data;
};

// // multiple 단일 선택 함수. 챗지피티가 만듬
// watch(selectedRows, (v) => {
//     if (v.length > 1) selectedRows.value = [v.at(-1)];
// });
</script>

<template>
    <CustSearchVue @submit="handleSubmit" @toss="handleToss" />
    <DataTable :value="custs" v-model:selection="selectcusts" dataKey="custCode" scrollable scrollHeight="40vh" selectionMode="single">
        <Column field="custCode" header="업체코드" sortable style="min-width: 5em"></Column>
        <Column field="custName" header="업체명" sortable style="min-width: 10em"></Column>
        <Column field="pschPhone" header="담당자연락처" sortable style="min-width: 3em"></Column>
    </DataTable>
</template>

<style></style>
