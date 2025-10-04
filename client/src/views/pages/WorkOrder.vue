<script setup>
import { ref } from 'vue';

const workOrder = ref([{ prodPlanDate: '2025-10-02', modelCode: 'G10002', revision: '0.0c', modelName: '휴지2', proc: '절단', workOrderProc: 300, unit: 'ea' }]);
const selectedModels = ref([]);
</script>

<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <!-- 화면 상단 제품 검색 부분-->
                <div class="grid grid-cols-12 gap-2">
                    <label for="prodPlanNo" class="flex items-center col-3 mb-2 md:mb-0">생산계획코드</label>
                    <div class="col-1"></div>
                    <AutoComplete id="prodPlanNo" class="col-span-6" v-model="selectedAutoValue" :suggestions="autoFilteredValue" optionLabel="name" placeholder="Search" dropdown display="chip" @complete="searchCountry($event)" />
                </div>
            </template>
            <template #end>
                <Button label="출력" class="p-button-outlined px-6 py-3 text-lg font-bold" />
                <Button label="저장" class="p-button-outlined px-6 py-3 text-lg font-bold" />
                <Button label="조회" class="p-button-outlined px-6 py-3 text-lg font-bold" />
            </template>
        </Toolbar>

        <!-- 작업지시 그리드 -->
        <DataTable ref="dt" v-model:selection="selectedModels" :value="workOrder" dataKey="id" :rows="10" :filters="filters" editMode="cell" @cell-edit-complete="onCellEditComplete" style="border: 1px solid #ddd; height: 70vh">
            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column field="prodPlanDate" header="생산계획일자" sortable style="min-width: 12rem"></Column>
            <Column field="modelCode" header="제품코드" sortable style="min-width: 16rem"></Column>
            <Column field="revision" header="리비전" sortable style="min-width: 16rem"></Column>
            <Column field="modelName" header="제품명" sortable style="min-width: 16rem"></Column>
            <Column field="proc" header="공정" sortable style="min-width: 16rem"></Column>
            <Column field="workOrderProc" header="작업지시수량" sortable style="min-width: 16rem">
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" showButtons mode="decimal" />
                </template>
            </Column>
            <Column field="unit" header="단위" sortable style="min-width: 16rem"></Column>
        </DataTable>
    </div>
</template>
