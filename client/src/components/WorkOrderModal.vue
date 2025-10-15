<script setup>
import axios from 'axios';
import Dialog from 'primevue/dialog';

import { onMounted, ref, watch, computed } from 'vue';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// props: 부모에서 전달한 작업지시번호
const props = defineProps({
    searchWorkOrdNo: String
});
// emits: 부모에게 데이터 전달
const emit = defineEmits(['reg']);

// 아래 두개가 모달 내부 상태
// 폼 데이터 객체
const workOrderData = ref({});
// 입력창 input값
const ModalWorkOrdNo = ref('');

// 여러 작업지시 데이터 저장
const workOrderList = ref([]);
// 선택된 행
const selectedWorkOrder = ref(null);

// 부모의 값이 바뀌면 local에도 반영
watch(
    () => props.searchWorkOrdNo,
    (newVal) => {
        console.log('👀 부모에서 받은 작업지시번호:', newVal);
        ModalWorkOrdNo.value = newVal;
        fetchWorkOrder(ModalWorkOrdNo.value);
    }
);

// 모달 열릴 때 자동 조회
onMounted(() => {
    console.log('📦 모달 마운트됨, 초기값:', props.searchWorkOrdNo);
    ModalWorkOrdNo.value = props.searchWorkOrdNo;
    fetchWorkOrder(ModalWorkOrdNo.value);
});

// 단건 or 전체 조회 함수
const fetchWorkOrder = async (workOrdNo = '') => {
    try {
        console.log('📡 조회 요청:', workOrdNo);
        const result = await axios.get(`${apiUrl}/resultwork/search`, {
            params: { workOrdNo: workOrdNo || '' }
        });
        console.log('✅ 조회 결과:', result.data);

        if (Array.isArray(result.data)) {
            // 전체 조회
            workOrderList.value = result.data;
        } else if (result.data && Object.keys(result.data).length > 0) {
            // 단건 조회도 리스트로 감싸서 표시
            workOrderList.value = [result.data];
        } else {
            // 결과 없을 때 초기화
            workOrderList.value = [];
        }
    } catch (err) {
        console.error('작업지시서 조회 실패:', err);
        workOrderList.value = [];
    }
};

// 조회된 데이터를 부모로 전달
// 선택한 데이터는 workOrderData.value에 저장되고 부모로 전달
// ✅ 행 선택 시 부모에게 전달
const onRowSelect = (event) => {
    workOrderData.value = event.data;
    emit('workOrdreg', event.data);
};

// const selectWorkOrder = () => {
//     emit('workOrdreg', workOrderData.value);
// };

// const modalToss = () => {
//     selectWorkOrder();
// };
</script>

<template>
    <InputText v-model="ModalWorkOrdNo" class="col-span-9" id="workord" type="text" />
    <!-- <Button label="저장" :disabled="!workOrderData" @click="modalToss"></Button> -->
    <Button label="조회" @click="fetchWorkOrder(ModalWorkOrdNo)"></Button>

    <DataTable :value="workOrderList" v-model:selection="selectedWorkOrder" selectionMode="single" dataKey="workOrdNo" scrollable scrollHeight="60vh" @rowSelect="onRowSelect">
        <Column field="workOrdNo" header="작업지시번호" style="min-width: 200px" />
        <Column header="작업제품정보">
            <template #body="slotProps"> {{ slotProps.data.modelCode }} / {{ slotProps.data.revision }} / {{ slotProps.data.modelName }} </template>
        </Column>
        <Column field="proc" header="작업공정" style="min-width: 150px" />
        <Column field="workOrdQty" header="작업수량" style="min-width: 120px" />
    </DataTable>
</template>

<style scoped>
.modalform {
    padding: 20px;
}
</style>
