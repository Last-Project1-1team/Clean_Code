<script setup>
import { ref } from 'vue';
import WorkOrderModal from '@/components/WorkOrderModal.vue';

const workOrdmodalVisible = ref(false);
</script>

<template>
    <div class="card flex flex-col gap-4">
        <div class="grid grid-cols-12 gap-2">
            <label for="name3" class="flex items-center col-span-2 mb-2">작업지시서</label>
            <InputText class="col-span-9" id="name3" type="text" />
            <Button @click="workOrdmodalVisible = true" type="button" class="mr-2 mb-2" icon="pi pi-search" />
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="email3" class="flex items-center col-span-2 mb-2">LOT번호</label>
            <InputText class="col-span-9" id="email3" type="text" />
            <Button type="button" class="mr-2 mb-2" icon="pi pi-search" />
        </div>

        <DataTable :value="workOrd" v-model:selection="selectedModel" datakey="workOrdNo" scrollable scrollHeight="400px" class="custom-table mt-6" @rowSelect="formData = { ...$event.data }">
            <Column field="workOrdNo" header="작업지시서 번호" style="min-width: 150px"></Column>
            <Column field="modelCode" header="제품코드" style="min-width: 150px"></Column>
            <Column field="revision" header="리비전" style="min-width: 150px"></Column>
            <Column field="modelName" header="제품명" style="min-width: 250px"></Column>
            <Column field="proc" header="공정" style="min-width: 150px"></Column>
            <Column field="workOrdQty" header="작업지시수량" style="min-width: 150px"></Column>
        </DataTable>

        <DataTable :value="LOTNo" v-model:selection="selectedModel" datakey="workOrdNo" scrollable scrollHeight="400px" class="custom-table mt-6" @rowSelect="formData = { ...$event.data }">
            <Column field="LotName" header="품명" style="min-width: 250px"></Column>
            <Column field="LotNo" header="품번" style="min-width: 150px"></Column>
            <Column field="proc" header="공정" style="min-width: 150px"></Column>
            <Column field="qty" header="수량" style="min-width: 150px"></Column>
        </DataTable>

        <Dialog v-model:visible="workOrdmodalVisible" header="작업지시서 조회" modal style="width: 80vw; height: 80vh">
            <WorkOrderModal @workOrdreg="handleWorkOrdRegister" />
        </Dialog>

        <div class="buttons">
            <Button class="cusbutton" label="시작" severity="success" raised />
            <!--<Button class="cusbutton col-span-4" label="일시정지" severity="warn" raised />-->
            <Button class="cusbutton" label="종료" severity="danger" raised />
        </div>
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
