<template>
    <Dialog v-model:modelModal="custmodal" modal header="업체" style="width: 70vw">
        <div class="grid grid-cols-10 gap-2">
            <label for="model_code" class="flex items-center">제품코드</label>
            <div class="col-span-2">
                <InputText id="model_code" type="text" class="w-full" />
            </div>
            <label for="model_name" class="flex items-center">제품명</label>
            <div class="col-span-2">
                <InputText id="model_name" type="text" class="w-full" />
            </div>
            <Button class="col-start-8" label="초기화"></Button>
            <Button class="col-start-9" label="등록" @click="searchModel"></Button>
            <Button class="col-start-10" label="조회"></Button>
        </div>
        <DataTable :value="modelList" v-model:selection="selectedModel" selectionMode="single" @rowSelect="onRowSelect" scrollable scrollHeight="400px" style="height: 40vh; border: 1px solid #ddd">
            <Column field="modelCode" header="제품코드" sortable style="min-width: 5em"></Column>
            <Column field="modelName" header="제품명" sortable style="min-width: 10em"></Column>
            <Column field="revision" header="리비전" sortable style="min-width: 3em"></Column>
            <Column field="modelFlag" header="제품구분" sortable style="min-width: 5em"></Column>
            <Column field="inordQty" header="수주량" sortable style="min-width: 5em"></Column>
            <Column field="completeOut" header="기 출고량" sortable style="min-width: 5em"></Column>
            <Column field="notOut" header="미 출고량" sortable style="min-width: 5em"></Column>
            <Column field="unit" header="단위" sortable style="min-width: 5em"></Column>
        </DataTable>
    </Dialog>
</template>
<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import Dialog from 'primevue/dialog';

const emit = defineEmits([]);
</script>
