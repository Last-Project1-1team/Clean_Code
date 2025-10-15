<script setup>
import axios from 'axios';
import Dialog from 'primevue/dialog';
import { onMounted, ref } from 'vue';
import OutordSearchVue from './OutordSearch.vue';

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const emit = defineEmits(['register']);
const outords = ref([]);
const selectOutord = ref([]);
const keyword = ref('');

const registerOutords = () => {
    // 부모로 선택된 데이터 전달
    emit('register', selectOutord.value);
};

const handleSubmit = (date) => {
    // console.log(date);
    getOutordList(date);
};
const handleToss = () => {
    registerOutords();
};

const getOutordList = async (dateRef) => {
    const rawDate = dateRef?.value ?? dateRef;
    const formatted = rawDate instanceof Date ? rawDate.toISOString().slice(0, 10) : rawDate || '';

    let result = await axios
        .get(`${apiUrl}/outorderList`, {
            params: {
                outordDate: formatted || ''
            }
        })
        .catch((err) => {
            console.error('발주 조회 실패:', err);
            outords.value = [];
        });
    console.log(result.data);
    outords.value = result.data;
};

// // multiple 단일 선택 함수. 챗지피티가 만듬
// watch(selectedRows, (v) => {
//     if (v.length > 1) selectedRows.value = [v.at(-1)];
// });
</script>

<template>
    <OutordSearchVue @submit="handleSubmit" @toss="handleToss" />
    <DataTable :value="outords" v-model:selection="selectOutord" dataKey="outordNo" scrollable scrollHeight="40vh" selectionMode="single">
        <Column field="outordNo" header="발주코드" sortable style="min-width: 5em"></Column>
        <Column field="outordDate" header="발주일자" sortable style="min-width: 5em"></Column>
        <Column field="custCode" header="업체코드" sortable style="min-width: 5em"></Column>
        <Column field="custName" header="업체명" sortable style="min-width: 5em"></Column>
        <Column field="deliveryDate" header="납기일자" sortable style="min-width: 5em"></Column>
    </DataTable>
</template>

<style></style>
