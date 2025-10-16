<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import Dialog from 'primevue/dialog';
import ItemMasterSearchSaveVue from '@/components/ItemMasterSearchSave.vue';
import CustSearchModal from '@/components/CustSearchModal.vue';
// import 제품모달창 from '';
// import 업체모달창 from '';
import axios from 'axios';
// import { onBeforeMount, shallowRef, computed } from 'vue';
// import useDateUtils from '@/utils/useDates.js';

const inputItems = ref([]); // 모달에서 넘어온 데이터 저장
const selectedRows = ref([]);
const outordNo = ref([]);
const custCode = ref([]);
const custName = ref([]);
const OutordmodalVisible = ref(false);
const toast = useToast();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const handleSubmit = (item) => {
    getInputList(item.code, item.name);
};

const getInputList = async (code, name) => {
    let result = await axios
        .get(`${apiUrl}/inputList?`, {
            params: {
                status: '5',
                itemCode: code || '',
                itemName: name || ''
            }
        })
        .catch((err) => {
            console.error('아이템 조회 실패:', err);
            inputItems.value = [];
        });
    console.log(result.data);
    inputItems.value = result.data;
};

const handleSave = () => {
    saveInputList();
};

const saveInputList = async () => {
    const payload = {
        items: selectedRows.value.map((item) => ({
            inputNo: item.inputNo
        }))
    };

    try {
        const response = await axios.post(`${apiUrl}/inputList`, payload);
        toast.add({ severity: 'success', summary: '입고가 확정되었습니다.', life: 3000 });
        getInputList('', '');
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: '저장 중 오류가 발생했습니다.', life: 3000 });
    }
};
</script>

<template>
    <div class="card flex flex-col gap-4 relative">
        <ItemMasterSearchSaveVue @submit="handleSubmit" @toss="handleSave" />
        <DataTable :value="inputItems" v-model:selection="selectedRows" dataKey="inputNo" selectionMode="multiple" scrollable scrollHeight="120vh" style="height: 77vh">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="inputNo" header="입고번호" sortable style="min-width: 5em"></Column>
            <Column field="inputDate" header="입고일자" sortable style="min-width: 5em"></Column>
            <Column field="itemCode" header="자재코드" sortable style="min-width: 5em"></Column>
            <Column field="itemName" header="자재명" sortable style="min-width: 10em"></Column>
            <Column field="spec" header="규격" sortable style="min-width: 10em"></Column>
            <Column field="unit" header="단위" sortable style="min-width: 3em"></Column>
            <Column field="inputQty" header="입고량" sortable style="min-width: 3em"></Column>
        </DataTable>
    </div>
    <!-- </div> -->
</template>
