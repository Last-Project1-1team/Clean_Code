<script setup>
import axios from 'axios';
import Dialog from 'primevue/dialog';

import { onMounted, ref } from 'vue';

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
</script>

<template>
    <DataTable :value="workOrd" v-model:selection="selectworkOrd" dataKey="workOrdNo" scrollable scrollHeight="40vh" selectionMode="single">
        <Column field="workOrdNo" header="작업지시서 번호" sortable style="min-width: 5em"></Column>
        <Column field="modelCode" header="제품코드" sortable style="min-width: 10em"></Column>
        <Column field="revision" header="리비전" sortable style="min-width: 3em"></Column>
        <Column field="modelName" header="제품명" sortable style="min-width: 3em"></Column>
        <Column field="proc" header="공정" sortable style="min-width: 3em"></Column>
        <Column field="workOrdQty" header="작업지시수량" sortable style="min-width: 3em"></Column>
    </DataTable>
</template>

<style></style>
