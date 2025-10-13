<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import Dialog from 'primevue/dialog';
import CustSearchModal from '@/components/CustSearchModal.vue';
import ModalSearchModel from '@/components/ModalSearchModel.vue';
import axios from 'axios';

const selectedinordmodel = ref([]);
const selectedmodels = ref([]);
const custCode = ref([]);
const custName = ref([]);
const pschphone = ref([]);
const modelcode = ref([]);
const selectedRows = ref([]);
const custmodalVisible = ref(false);
const modelmodalVisible = ref(false);
const today = ref(new Date()); // 오늘 날짜
const selectedDate = ref(new Date(new Date().setDate(new Date().getDate() + 7)));

const handleCustRegister = (custs) => {
    // 부모 테이블에 추가 (기존 데이터 유지 + 신규 추가)
    custCode.value = custs.custCode;
    custName.value = custs.custName;
    pschphone.value = custs.pschPhone;

    custmodalVisible.value = false; // 모달 닫기
};

const handleModelRegister = (models) => {
    // 부모 테이블에 추가 (기존 데이터 유지 + 신규 추가)
    const mapped = models
        .filter((model) => {
            // 이미 등록된 ITEM_CODE는 제외
            return !selectedmodels.value.some((si) => si.MODEL_CODE === model.modelCode);
        })
        .map((model) => ({
            MODEL_CODE: model.modelCode,
            MODEL_NAME: model.modelName,
            REVISION: model.revision,
            INORD_QTY: model.inordQty,
            UNIT: model.unit
        }));

    selectedmodels.value = [...selectedmodels.value, ...mapped];
    modelmodalVisible.value = false; // 모달 닫기
};
</script>

<template>
    <div class="card flex flex-col gap-4" style="height: 100vh">
        <div class="grid grid-cols-12 gap-2">
            <label for="CUST_CODE" class="flex items-center">업체코드</label>
            <div class="col-span-2">
                <div class="grid grid-cols-[1fr_auto] gap-2">
                    <InputText v-model="custCode" class="w-full" />
                    <Button @click="custmodalVisible = true" icon="pi pi-search" class="flex-none" style="width: 2.5rem; height: 2.5rem" />
                </div>
            </div>
            <label for="form.PSCH_PHONE " class="flex items-center">담당자 연락처</label>
            <div class="col-span-2">
                <InputText v-model="pschphone" type="text" class="w-full" />
            </div>
            <Button click="" type="submit" class="col-start-12" label="저장" />
        </div>

        <div class="grid grid-cols-12 gap-2">
            <label for="form.CUST_NAME" class="flex items-center">업체명</label>
            <div class="col-start-2 col-end-7">
                <InputText v-model="custName" type="text" class="w-full" />
            </div>
        </div>

        <div class="grid grid-cols-12 gap-2">
            <label for="MODEL_CODE" class="flex items-center">제품코드</label>
            <div class="col-span-2">
                <div class="grid grid-cols-[1fr_auto] gap-2">
                    <InputText v-model="modelcode" class="w-full" />
                    <Button @click="modelmodalVisible = true" icon="pi pi-search" class="flex-none" style="width: 2.5rem; height: 2.5rem" />
                </div>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-2">
            <label for="INORD_DATE" class="flex items-center">수주일</label>
            <div class="col-span-2">
                <DatePicker v-model="today" class="w-full" name="inordDate" dateFormat="yy-mm-dd" showIcon showButtonBar iconDisplay="input" inputId="icondisplay" />
            </div>
            <label for="PAPRD_DATE" class="flex items-center">납기일</label>
            <div class="col-span-2">
                <DatePicker v-model="selectedDate" class="w-full" name="paprddate" dateFormat="yy-mm-dd" showIcon showButtonBar iconDisplay="input" inputId="icondisplay" />
            </div>
            <Button class="col-start-12" label="Submit">삭제</Button>
        </div>

        <Dialog v-model:visible="custmodalVisible" header="업체 검색" modal style="width: 80vw; height: 80vh">
            <CustSearchModal @custreg="handleCustRegister" />
            <!-- @select="handleCustSelect"-->
        </Dialog>

        <Dialog v-model:visible="modelmodalVisible" header="제품 검색" modal style="width: 80vw; height: 80vh">
            <ModalSearchModel @register="handleModelRegister" />
        </Dialog>

        <DataTable :value="selectedinordmodel" v-model:selection="selectedRows" scrollable scrollHeight="400px" style="height: 40vh; border: 1px solid #ddd">
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
