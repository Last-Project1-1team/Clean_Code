<script setup>
import { ref } from 'vue';
import WorkOrderModal from '@/components/WorkOrderModal.vue';

const openWorkOrdModal = ref(false);
// 입력한 작업지시번호
const searchWorkOrdNo = ref('');
// 선택된 작업지시 정보
const selectedWorkOrder = ref({});
const workOrd = ref([]); // DataTable에 보여질 데이터
const selectedModel = ref(null); // 선택된 행
const formData = ref({}); // rowSelect 시 표시할 데이터

// 모달에서 선택된 작업지시 받아오기
const onSelectWorkOrd = (data) => {
    workOrd.value = [data]; // 선택된 데이터 표시
    openWorkOrdModal.value = false; // 모달 닫기
};
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-2">
            <label for="workord" class="flex items-center col-span-2 mb-2">작업지시서</label>
            <InputText v-model="searchWorkOrdNo" class="col-span-9" id="workord" type="text" />
            <Button @click="openWorkOrdModal = true" type="button" class="mr-2 mb-2" icon="pi pi-search" />
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="email3" class="flex items-center col-span-2 mb-2">LOT번호</label>
            <InputText class="col-span-9" id="email3" type="text" />
            <Button type="button" class="mr-2 mb-2" icon="pi pi-search" />
        </div>
    </div>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">Horizontal</div>
        <div class="grid grid-cols-12 gap-2">
            <label for="name3" class="flex items-center col-span-12 mb-2">작업지시번호</label>
            <div class="col-span-12 md:col-span-10">
                <InputText v-model="selectedWorkOrder.workOrdNo" id="name3" type="text" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="email3" class="flex items-center col-span-12 mb-2">작업제품</label>
            <div class="col-span-12 md:col-span-10">
                <InputText v-model="selectedWorkOrder.modelCode" id="email3" type="text" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="name3" class="flex items-center col-span-12 mb-2">작업공정</label>
            <div class="col-span-12 md:col-span-10">
                <InputText v-model="selectedWorkOrder.proc" id="name3" type="text" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="email3" class="flex items-center col-span-12 mb-2">작업수량</label>
            <div class="col-span-12 md:col-span-10">
                <InputText v-model="selectedWorkOrder.workOrdQty" id="email3" type="text" />
            </div>
        </div>
    </div>

    <!-- <DataTable :value="workOrd" v-model:selection="selectedWorkOrd" datakey="workOrdNo" scrollable scrollHeight="400px" class="custom-table mt-6" @rowSelect="formData = { ...$event.data }">
            <Column field="workOrdNo" header="작업지시서 번호" style="min-width: 150px"></Column>
            <Column field="modelCode" header="제품코드" style="min-width: 150px"></Column>
            <Column field="revision" header="리비전" style="min-width: 150px"></Column>
            <Column field="modelName" header="제품명" style="min-width: 250px"></Column>
            <Column field="proc" header="공정" style="min-width: 150px"></Column>
            <Column field="workOrdQty" header="작업지시수량" style="min-width: 150px"></Column>
        </DataTable> -->

    <DataTable :value="LOTNo" v-model:selection="selectedModel" datakey="workOrdNo" scrollable scrollHeight="400px" class="custom-table mt-6" @rowSelect="formData = { ...$event.data }">
        <Column field="LotName" header="품명" style="min-width: 250px"></Column>
        <Column field="LotNo" header="품번" style="min-width: 150px"></Column>
        <Column field="proc" header="공정" style="min-width: 150px"></Column>
        <Column field="qty" header="수량" style="min-width: 150px"></Column>
    </DataTable>

    <Dialog v-model:visible="openWorkOrdModal" header="작업지시서 조회" modal style="width: 80vw; height: 80vh">
        <WorkOrderModal :searchWorkOrdNo="searchWorkOrdNo" @workOrdreg="onSelectWorkOrd" />
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
</style>
