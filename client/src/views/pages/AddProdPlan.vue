<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <div class="grid grid-cols-12 gap-2">
                    <label for="startPlan" class="flex items-center col-span-1 mb-2 md:mb-0">계획시작일</label>
                    <div class="col-span-3">
                        <DatePicker id="startPlan" :showIcon="true" :showButtonBar="true" v-model="startPlanDate" date-format="yy-mm-dd" style="width: 250px"></DatePicker>
                    </div>

                    <label for="endPlan" class="flex items-center col-span-1 mb-2 md:mb-0">계획종료일</label>
                    <div class="col-span-2">
                        <DatePicker class="col-span-2" id="endPlan" :showIcon="true" :showButtonBar="true" v-model="endPlanDate" date-format="yy-mm-dd"></DatePicker>
                    </div>

                    <div class="col-span-2"></div>

                    <Button label="초기화" @click="initPlan"></Button>
                    <Button label="저장" @click="addPlan"></Button>
                    <Button label="조회" @click="searchPlan"></Button>

                    <label for="modelName" class="flex items-center col-span-1 mb-2 md:mb-0">제품코드</label>
                    <div class="col-span-3">
                        <InputText v-model="modelName" id="modelName" type="text" style="width: 175px" />
                        <Button @click="ModalSearch = true" class="w-full" type="button" icon="pi pi-search" />
                        <ModalSearchModel v-model:visible="ModalSearch" @selectModel="onModelSelected" />
                    </div>
                    <label for="modelName" class="flex items-center col-span-1 mb-2 md:mb-0">리비전</label>
                    <div class="col-span-2">
                        <InputText v-model="modelName" id="modelName" type="text" class="w-full" />
                    </div>

                    <div class="col-span-5"></div>

                    <label for="modelName" class="flex items-center col-span-1 mb-2 md:mb-0">제품명</label>
                    <div class="col-span-3">
                        <InputText v-model="modelName" id="modelName" type="text" style="width: 210px" />
                    </div>
                    <label for="selectProc" class="flex items-center col-span-1 mb-2 md:mb-0">공정선택</label>
                    <div class="col-span-2">
                        <Select id="selectProc" v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="공정선택" class="w-full" />
                    </div>

                    <div class="col-span-4"></div>
                    <Button label="삭제" @click="deletePlan"></Button>
                </div>
            </template>
        </Toolbar>

        <!-- 생산계획 등록 그리드 -->
        <DataTable ref="dt" v-model:selection="selectedPlans" :value="prodPlan" dataKey="prodPlanNo" :rows="10" :filters="filters" editMode="cell" @cell-edit-complete="onCellEditComplete" style="border: 1px solid #ddd; height: 60vh">
            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column field="prodPlanDate" header="계획등록일자" sortable style="min-width: 12rem"></Column>
            <Column field="prodPlanDate" header="계획시작일자" sortable style="min-width: 12rem"></Column>
            <Column field="prodPlanDate" header="생산종료일자" sortable style="min-width: 12rem"></Column>
            <Column field="modelCode" header="제품코드" sortable style="min-width: 16rem"></Column>
            <Column field="revision" header="리비전" sortable style="min-width: 16rem"></Column>
            <Column field="modelName" header="제품명" sortable style="min-width: 16rem"></Column>
            <Column field="proc" header="공정" sortable style="min-width: 16rem"></Column>
            <Column field="prodPlanDate" header="수주량" sortable style="min-width: 12rem"></Column>
            <Column field="prodPlanDate" header="기 출고량" sortable style="min-width: 12rem"></Column>
            <Column field="prodPlanDate" header="미 출고량" sortable style="min-width: 12rem"></Column>
            <Column field="workOrderQty" header="계획수량" sortable style="min-width: 16rem">
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" showButtons mode="decimal" />
                </template>
            </Column>
            <Column field="unit" header="단위" sortable style="min-width: 16rem"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import ModalSearchModel from '@/components/ModalSearchModel.vue';

const ModalSearch = ref(false);
</script>
