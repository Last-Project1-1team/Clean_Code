<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, onBeforeMount, shallowRef, computed } from 'vue';
import Dialog from 'primevue/dialog';
import CustomModal from '@/views/pages/auth/custmodal.vue';
import axios from 'axios';
// import ModelModal  from
// import 제품모달창 from '';
// import 업체모달창 from '';
// import axios from 'axios';
// import { onBeforeMount, shallowRef, computed } from 'vue';
// import useDateUtils from '@/utils/useDates.js';

//
const selectinord = ref([
    { MODEL_CODE: 'MODEL-0001', MODEL_NAME: '휴지1', REVISION: '0.0a', INORD_QTY: '2000', UNIT: 'KG' },
    { MODEL_CODE: 'MODEL-0002', MODEL_NAME: '휴지2', REVISION: '0.0a', INORD_QTY: '2000', UNIT: 'KG' },
    { MODEL_CODE: 'MODEL-0003', MODEL_NAME: '휴지3', REVISION: '0.0a', INORD_QTY: '2000', UNIT: 'KG' },
    { MODEL_CODE: 'MODEL-0004', MODEL_NAME: '휴지4', REVISION: '0.0a', INORD_QTY: '2000', UNIT: 'KG' },
    { MODEL_CODE: 'MODEL-0005', MODEL_NAME: '휴지5', REVISION: '0.0a', INORD_QTY: '2000', UNIT: 'KG' },
    { MODEL_CODE: 'MODEL-0006', MODEL_NAME: '휴지6', REVISION: '0.0a', INORD_QTY: '2000', UNIT: 'KG' },
    { MODEL_CODE: 'MODEL-0007', MODEL_NAME: '휴지7', REVISION: '0.0a', INORD_QTY: '2000', UNIT: 'KG' },
    { MODEL_CODE: 'MODEL-0008', MODEL_NAME: '휴지8', REVISION: '0.0a', INORD_QTY: '2000', UNIT: 'KG' },
    { MODEL_CODE: 'MODEL-0009', MODEL_NAME: '휴지9', REVISION: '0.0a', INORD_QTY: '2000', UNIT: 'KG' },
    { MODEL_CODE: 'MODEL-0010', MODEL_NAME: '휴지10', REVISION: '0.0a', INORD_QTY: '2000', UNIT: 'KG' },
    { MODEL_CODE: 'MODEL-0011', MODEL_NAME: '휴지11', REVISION: '0.0a', INORD_QTY: '2000', UNIT: 'KG' },
    { MODEL_CODE: 'MODEL-0012', MODEL_NAME: '휴지12', REVISION: '0.0a', INORD_QTY: '2000', UNIT: 'KG' },
    { MODEL_CODE: 'MODEL-0013', MODEL_NAME: '휴지13', REVISION: '0.0a', INORD_QTY: '2000', UNIT: 'KG' }
]);

const selectedRows = ref([]);

const modelopen = ref(false);

const saveinord = ref([]);

const modalopen = ref(false);
</script>

<template>
    <div class="card flex flex-col gap-4" style="height: 100vh">
        <div class="grid grid-cols-12 gap-2">
            <label for="CUST_CODE" class="flex items-center">업체코드</label>
            <div class="col-span-2">
                <div class="grid grid-cols-[1fr_auto] gap-2">
                    <InputText v-model="value" class="w-full" />
                    <Button @click="modalopen = true" icon="pi pi-search" class="flex-none" style="width: 2.5rem; height: 2.5rem" />
                    <CustomModal v-model:visible="modalopen" />
                </div>
            </div>
            <label for="CEO_PHONE" class="flex items-center">담당자 연락처</label>
            <div class="col-span-2">
                <InputText id="PSCH_PHONE" type="text" class="w-full" />
            </div>
            <Button click="" type="submit" class="col-start-12" label="저장" />
        </div>

        <div class="grid grid-cols-12 gap-2">
            <label for="CUST_NAME" class="flex items-center">업체명</label>
            <div class="col-start-2 col-end-7">
                <InputText id="PSCH_PHONE" type="text" class="w-full" />
            </div>
        </div>

        <div class="grid grid-cols-12 gap-2">
            <label for="MODEL_CODE" class="flex items-center">제품코드</label>
            <div class="col-span-2">
                <div class="grid grid-cols-[1fr_auto] gap-2">
                    <InputText v-model="value" class="w-full" />
                    <Button @click="modelopen = true" icon="pi pi-search" class="flex-none" style="width: 2.5rem; height: 2.5rem" />
                </div>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-2">
            <label for="INORD_DATE" class="flex items-center">수주일</label>
            <div class="col-span-2">
                <InputText id="PSCH_PHONE" type="date" class="w-full" />
            </div>
            <label for="PAPRD_DATE" class="flex items-center">납기일</label>
            <div class="col-span-2">
                <InputText id="PSCH_PHONE" type="date" class="w-full" />
            </div>
            <Button class="col-start-12" label="Submit">삭제</Button>
        </div>

        <DataTable :value="selectinord" v-model:selection="selectedRows" scrollable scrollHeight="400px" style="height: 40vh; border: 1px solid #ddd">
            <Column selectionMode="multiple" style="width: 3rem"></Column>
            <Column field="MODEL_CODE" header="제품코드" sortable style="min-width: 5em"></Column>
            <Column field="MODEL_NAME" header="제품명" sortable style="min-width: 10em"></Column>
            <Column field="REVISION" header="리비전" sortable style="min-width: 3em"></Column>
            <!-- 수주량 인풋박스 -->
            <Column field="INORD_QTY" header="수주량" sortable style="min-width: 3em">
                <template #body="{ data }">
                    <input v-model.number="data.INORD_QTY" type="number" min="0" step="1" class="w-24 border p-1" />
                </template>
            </Column>

            <Column field="UNIT" header="단위" sortable style="min-width: 3em"></Column>
        </DataTable>
    </div>
</template>
