<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import Dialog from 'primevue/dialog';
import CustSearchModal from '@/components/CustSearchModal.vue';
import ModelSearchModal from '@/components/ModelSearchModal1.vue';
import axios from 'axios';

const selectedmodel = ref([]);
const selectedmodels = ref([]);
const custCode = ref('');
const custName = ref('');
const pschphone = ref([]);
const modelcode = ref([]);
const selectedRows = ref([]);
const custmodalVisible = ref(false);
const modelmodalVisible = ref(false);
const today = ref([]); // 오늘 날짜
const selectedDate = ref(new Date(new Date().setDate(new Date().getDate() + 7)));
const toast = useToast();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const handleCustRegister = (custs) => {
    // 부모 테이블에 추가 (기존 데이터 유지 + 신규 추가)
    custCode.value = custs.custCode;
    custName.value = custs.custName;

    custmodalVisible.value = false; // 모달 닫기
};

//datatable
const handleModelRegister = (models) => {
    // 부모 테이블에 추가 (기존 데이터 유지 + 신규 추가)
    const mapped = models
        .filter((model) => {
            // 이미 등록된 ITEM_CODE는 제외
            return !selectedmodel.value.some((si) => si.MODEL_CODE === model.modelCode);
        })
        .map((model) => ({
            MODEL_CODE: model.modelCode,
            MODEL_NAME: model.modelName,
            REVISION: model.revision,
            INORD_QTY: model.inordQty,
            UNIT: model.unit
        }));

    selectedmodel.value = [...selectedmodel.value, ...mapped];
    modelmodalVisible.value = false; // 모달 닫기
};

// onMounted(getInordList);
const onselect = () => {
    getShipList();
};

const getShipList = async () => {
    let result = await axios
        .get(`${apiUrl}/shiplist?`, {
            params: {
                custCode: custCode.value || '',
                today: today.value || ''
            }
        })
        .catch((err) => {
            console.error('수주 조회 실패:', err);
            selectedmodel.value = [];
        });
    selectedmodel.value = result.data;
};
</script>

<template>
    <div class="card flex flex-col gap-4 relative" style="height: 100vh">
        <div id="button_" class="absolute top-4 right-10 flex gap-2 z-10">
            <Button label="조회" class="p-button-success px-6 py-3 text-lg font-bold" style="width: 100px; height: 50px" @click="onselect" />
        </div>

        <div class="grid grid-cols-12 gap-2">
            <label for="CUST_CODE" class="flex items-center">업체코드</label>
            <div class="col-span-2">
                <div class="grid grid-cols-[1fr_auto] gap-2">
                    <InputText v-model="custCode" class="w-full" />
                    <Button @click="custmodalVisible = true" icon="pi pi-search" class="flex-none" style="width: 2.5rem; height: 2.5rem" />
                </div>
            </div>
            <label for="form.CUST_NAME" class="flex items-center">업체명</label>
            <div class="col-span-2">
                <InputText v-model="custName" type="text" class="w-full" />
            </div>
        </div>

        <div class="grid grid-cols-12 gap-2">
            <label for="INORD_DATE" class="flex items-center">출하일</label>
            <div class="col-span-2">
                <DatePicker v-model="today" class="w-full" name="inordDate" dateFormat="yy-mm-dd" showIcon showButtonBar iconDisplay="input" inputId="icondisplay" />
            </div>
        </div>

        <Dialog v-model:visible="custmodalVisible" header="업체 검색" modal style="width: 80vw; height: 80vh">
            <CustSearchModal @custreg="handleCustRegister" />
            <!-- @select="handleCustSelect"-->
        </Dialog>

        <Dialog v-model:visible="modelmodalVisible" header="제품 검색" modal style="width: 80vw; height: 80vh">
            <ModelSearchModal @register="handleModelRegister" />
        </Dialog>

        <DataTable :value="selectedmodel" scrollable scrollHeight="400px" style="height: 40vh; border: 1px solid #ddd">
            <Column field="CUST_NO" header="업체코드" sortable style="min-width: 5em"></Column>
            <Column field="CUST_NAME" header="업체명" sortable style="min-width: 5em"></Column>
            <Column field="MODEL_CODE" header="제품코드" sortable style="min-width: 5em"></Column>
            <Column field="MODEL_NAME" header="제품명" sortable style="min-width: 10em"></Column>
            <Column field="REVISION" header="리비전" sortable style="min-width: 3em"></Column>
            <!-- 수주량 인풋박스 -->
            <Column field="SIHP_QTY" header="출하량" sortable style="min-width: 3em"> </Column>

            <Column field="SHIP_DATE" header="출하일" sortable style="min-width: 3em"></Column>
        </DataTable>
    </div>
</template>
