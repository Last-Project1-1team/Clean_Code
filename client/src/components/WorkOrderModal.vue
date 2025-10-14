<script setup>
import axios from 'axios';
import Dialog from 'primevue/dialog';

import { onMounted, ref, watch } from 'vue';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// props: 부모에서 전달한 작업지시번호
const props = defineProps({
    searchWorkOrdNo: String
});
// emits: 부모에게 데이터 전달
const emit = defineEmits(['workOrdreg']);

// 아래 두개가 모달 내부 상태
// 폼 데이터 객체
const workOrderData = ref({});
// 입력창 input값
const ModalWorkOrdNo = ref('');

// 부모의 값이 바뀌면 local에도 반영
watch(
    () => props.searchWorkOrdNo,
    (newVal) => {
        ModalWorkOrdNo.value = newVal;
        fetchWorkOrder(ModalWorkOrdNo.value);
    }
);

// 모달 열릴 때 자동 조회
onMounted(() => {
    ModalWorkOrdNo.value = props.searchWorkOrdNo;
    fetchWorkOrder(ModalWorkOrdNo.value);
});

// onMounted(async () => {
//     getCustList('', '');
// });

const fetchWorkOrder = async (workOrderNo) => {
    try {
        const result = await axios.get(`${apiUrl}/resultwork/search?`, {
            params: { workOrderNo: workOrderNo || '' }
        });

        // result가 정상 응답이면 data 갱신
        workOrderData.value = result.data;
    } catch (err) {
        console.error('작업지시서 조회 실패:', err);
        workOrderData.value = []; // 실패 시 빈 배열로 초기화
    }
};

// 조회된 데이터를 부모로 전달
// 선택한 데이터는 workOrderData.value에 저장되고 selectWorkOrder 이벤트를 통해 부모로 전달
function selectWorkOrder() {
    emit('workOrdreg', workOrderData.value);
}
</script>

<template>
    <InputText v-model="ModalWorkOrdNo" class="col-span-9" id="workord" type="text" />
    <Button label="저장" :disabled="!workOrderData" @click="selectWorkOrder"></Button>
    <Button label="조회" @click="fetchWorkOrder"></Button>

    <div class="grid grid-cols-12 gap-2">
        <label for="name3" class="flex items-center col-span-12 mb-2">작업지시번호</label>
        <div class="col-span-12 md:col-span-10">
            <InputText v-model="workOrderData.workOrdNo" id="name3" type="text" disabled />
        </div>
    </div>
    <div class="grid grid-cols-12 gap-2">
        <label for="email3" class="flex items-center col-span-12 mb-2">작업제품</label>
        <div class="col-span-12 md:col-span-10">
            <InputText v-model="workOrderData.ModelCode" id="email3" type="text" disabled />
        </div>
    </div>
    <div class="grid grid-cols-12 gap-2">
        <label for="name3" class="flex items-center col-span-12 mb-2">작업공정</label>
        <div class="col-span-12 md:col-span-10">
            <InputText v-model="workOrderData.proc" id="name3" type="text" disabled />
        </div>
    </div>
    <div class="grid grid-cols-12 gap-2">
        <label for="email3" class="flex items-center col-span-12 mb-2">작업수량</label>
        <div class="col-span-12 md:col-span-10">
            <InputText v-model="workOrderData.workOrdQty" id="email3" type="text" disabled />
        </div>
    </div>
</template>

<style></style>
