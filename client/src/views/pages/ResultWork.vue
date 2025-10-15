<script setup>
import { ref, computed } from 'vue';
import WorkOrderModal from '@/components/WorkOrderModal.vue';

const modelInfo = computed(() => {
    const d = selectedWorkOrder.value;
    return d && d.modelCode ? `${d.modelCode} / ${d.revision} / ${d.modelName}` : '';
});

// 작업지시 모달 오픈 전 false 상태
const openWorkOrdModal = ref(false);
// 입력한 작업지시번호
const searchWorkOrdNo = ref('');
// 선택된 작업지시 정보
const selectedWorkOrder = ref({});
const workOrd = ref([]); // DataTable에 보여질 데이터
const formData = ref({}); // rowSelect 시 표시할 데이터

// 모달에서 선택된 작업지시 받아오기
const onSelectWorkOrd = (data) => {
    selectedWorkOrder.value = data; // 모달에서 선택된 데이터 저장
    workOrd.value = [data]; // 선택된 데이터 표시
    openWorkOrdModal.value = false; // 모달 닫기
};

const openModalWithSearch = () => {
    console.log('🔍 부모 검색 버튼 클릭:', searchWorkOrdNo.value);
    openWorkOrdModal.value = true;
    searchWorkOrdNo.value = '';
};

// lot모달 오픈 전 false 상태
const openLotModal = ref(false);
// 입력한 작업지시번호
const searchLotNo = ref('');
// 선택된 행
const selectedLot = ref(null);
// DataTable에 보여질 데이터
const lot = ref([]);
// 여러 작업지시 데이터 저장 그리드 연결
const LotNoList = ref([]);

// 모달에서 선택된 Lot정보 받아오기
const onSelectLot = (data) => {
    selectedLot.value = data; // 모달에서 선택된 데이터 저장
    lot.value = [data]; // 선택된 데이터 표시
    openLotModal.value = false; // 모달 닫기
};

const openModalWithLot = () => {
    console.log('🔍 부모 검색 버튼 클릭:', searchLotNo.value);
    openLotModal.value = true;
    searchLotNo.value = '';
};
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-2">
            <label for="workord" class="flex items-center col-span-2 mb-2">작업지시서</label>
            <InputText v-model="searchWorkOrdNo" class="col-span-9" id="workord" type="text" />
            <Button @click="openModalWithSearch" type="button" class="mr-2 mb-2" icon="pi pi-search" />
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="lotNo" class="flex items-center col-span-2 mb-2">LOT번호</label>
            <InputText v-model="searchLotNo" class="col-span-9" id="lotNo" type="text" />
            <Button @click="openModalWithLot" type="button" class="mr-2 mb-2" icon="pi pi-search" />
        </div>
    </div>

    <!-- 작업지시서 조회 결과-->
    <div class="modalform card flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="name3" class="col-span-2">작업지시번호</label>
            <InputText v-model="selectedWorkOrder.workOrdNo" class="col-span-9" id="name3" type="text" />
        </div>
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="email3" class="col-span-2">작업제품정보</label>
            <InputText :value="modelInfo" class="col-span-9" id="email3" type="text" />
        </div>
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="name3" class="col-span-2">작업공정</label>
            <InputText v-model="selectedWorkOrder.proc" class="col-span-9" id="name3" type="text" />
        </div>
        <div class="grid grid-cols-12 gap-2 mb-4">
            <label for="email3" class="col-span-2">작업수량</label>
            <InputText v-model="selectedWorkOrder.workOrdQty" class="col-span-9" id="email3" type="text" />
        </div>
    </div>

    <!-- LOT번호 조회 결과-->
    <DataTable :value="LotNoList" v-model:selection="selectedLot" datakey="workOrdNo" scrollable scrollHeight="400px" class="custom-table mt-6" @rowSelect="formData = { ...$event.data }">
        <Column field="LotName" header="품번" style="min-width: 250px"></Column>
        <Column field="LotNo" header="품명" style="min-width: 150px"></Column>
        <Column field="needQty" header="필요수량" style="min-width: 150px"></Column>
        <Column field="readyQty" header="준비수량" style="min-width: 150px"></Column>
        <Column field="unit" header="단위" style="min-width: 150px"></Column>
    </DataTable>

    <Dialog v-model:visible="openWorkOrdModal" header="작업지시서 조회" modal style="width: 80vw; height: 80vh">
        <WorkOrderModal :searchWorkOrdNo="searchWorkOrdNo" @workOrdreg="onSelectWorkOrd" />
    </Dialog>
    <Dialog v-model:visible="openLotModal" header="Lot번호 조회" modal style="width: 80vw; height: 80vh">
        <WorkOrderModal :searchLotNo="searchLotNo" @lotreg="onSelectLot" />
    </Dialog>

    <div class="buttons">
        <Button class="cusbutton" label="시작" severity="success" raised />
        <!--<Button class="cusbutton col-span-4" label="일시정지" severity="warn" raised />-->
        <Button class="cusbutton" label="종료" severity="danger" raised />
    </div>
</template>

<style scoped>
.custom-table {
    height: 20vh;
    border: 1px solid #ddd;
    border-radius: 10px;
}
.cusbutton {
    height: 15vh;
    width: 50vh;
}
.buttons {
    margin: 0 auto;
}
.modalform {
    padding: 10px;
}
</style>
