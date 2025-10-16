<script setup>
import axios from 'axios';
import Dialog from 'primevue/dialog';

import { onMounted, ref, watch, computed } from 'vue';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// props: 부모에서 전달한 작업지시번호
const props = defineProps({
    searchLotNo: String
});
// emits: 부모에게 데이터 전달
const emit = defineEmits(['lotreg']);

// 아래 두개가 모달 내부 상태
// 폼 데이터 객체
const lotData = ref({});
// 입력창 input값
const ModalLotNo = ref('');

// 여러 작업지시 데이터 저장
const lotList = ref([]);
// 선택된 행
const selectedLot = ref(null);

// 부모의 값이 바뀌면 local에도 반영
watch(
    () => props.searchLotNo,
    (newVal) => {
        console.log('👀 부모에서 받은 작업지시번호:', newVal);
        ModalLotNo.value = newVal;
        fetchLot(ModalLotNo.value);
    }
);

// 모달 열릴 때 자동 조회
onMounted(() => {
    console.log('📦 모달 마운트됨, 초기값:', props.searchLotNo);
    ModalLotNo.value = props.searchLotNo;
    fetchLot(ModalLotNo.value);
});

// Lot 단건 or 전체 조회 함수
const fetchLot = async (lotNo = '') => {
    try {
        console.log('📡 조회 요청:', lotNo);
        const result = await axios.get(`${apiUrl}/resultwork/lotlist`, {
            params: { lotNo }
        });
        console.log('✅ 조회 결과:', result.data);

        if (Array.isArray(result.data)) {
            // 전체 조회
            lotList.value = result.data;
        } else if (result.data && Object.keys(result.data).length > 0) {
            // 단건 조회도 리스트로 감싸서 표시
            lotList.value = [result.data];
        } else {
            // 결과 없을 때 초기화
            lotList.value = [];
        }
    } catch (err) {
        console.error('작업지시서 조회 실패:', err);
        lotList.value = [];
    }
};

// 조회된 데이터를 부모로 전달
// 선택한 데이터는 workOrderData.value에 저장되고 부모로 전달
// ✅ 행 선택 시 부모에게 전달
const onRowSelect = (event) => {
    lotData.value = event.data;
    emit('lotreg', event.data);
};
</script>

<template>
    <InputText v-model="ModalLotNo" class="col-span-9" id="workord" type="text" />
    <Button label="조회" @click="fetchLot(ModalLotNo)"></Button>

    <DataTable :value="lotList" v-model:selection="selectedLot" selectionMode="single" dataKey="workOrdNo" scrollable scrollHeight="60vh" @rowSelect="onRowSelect">
        <Column field="lotNo" header="Lot번호" style="min-width: 250px"></Column>
        <Column field="itemCode" header="품번" style="min-width: 150px"></Column>
        <Column field="itemName" header="품명" style="min-width: 250px"></Column>
        <Column field="lotQty" header="준비수량" style="min-width: 150px"></Column>
        <Column field="unit" header="단위" style="min-width: 150px"></Column>
    </DataTable>
</template>

<style scoped>
.modalform {
    padding: 20px;
}
</style>
