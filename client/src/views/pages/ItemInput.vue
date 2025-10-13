<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import Dialog from 'primevue/dialog';
import OutordSearchModal from '@/components/OutordSearchModal.vue';
import CustSearchModal from '@/components/CustSearchModal.vue';
// import 제품모달창 from '';
// import 업체모달창 from '';
import axios from 'axios';
// import { onBeforeMount, shallowRef, computed } from 'vue';
// import useDateUtils from '@/utils/useDates.js';

const selectedItems = ref([]); // 모달에서 넘어온 데이터 저장
const selectedCusts = ref([]);
const outordNo = ref([]);
const custCode = ref([]);
const custName = ref([]);
const itemCode = ref('');
const OutordmodalVisible = ref(false);
const toast = useToast();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const handleCustRegister = (custs) => {
    // 부모 테이블에 추가 (기존 데이터 유지 + 신규 추가)
    outordNo.value = custs.outordNo;
    custCode.value = custs.custCode;
    custName.value = custs.custName;

    OutordmodalVisible.value = false; // 모달 닫기
};

const onDelete = () => {
    selectedItems.value = selectedItems.value.filter((item) => !selectedRows.value.includes(item));
    selectedRows.value = [];
};

const onSave = async () => {
    if (custCode.value == '') {
        toast.add({ severity: 'error', summary: '거래처를 먼저 선택해주세요.', life: 3000 });
        return;
    }
    if (selectedItems.value == '') {
        toast.add({ severity: 'error', summary: '자재 정보가 없습니다.', life: 3000 });
        return;
    }

    const payload = {
        orderDate: today.value,
        deliveryDate: selectedDate.value,
        custCode: custCode.value,
        items: selectedItems.value.map((item) => ({
            itemCode: item.ITEM_CODE,
            qty: item.OUTORD_QTY
        }))
    };

    try {
        const response = await axios.post(`${apiUrl}/outord`, payload);
        toast.add({ severity: 'success', summary: '발주가 저장되었습니다.', life: 3000 });
        selectedItems.value = [];
        selectedRows.value = [];
        today.value = new Date();
        selectedDate.value = new Date(new Date().setDate(new Date().getDate() + 7));
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: '저장 중 오류가 발생했습니다.', life: 3000 });
    }
};
const selectedRows = ref([]);

const custopen = ref(false);
const modelopen = ref(false);

const saveinord = ref([]);
const today = ref(new Date()); // 오늘 날짜
const selectedDate = ref(new Date(new Date().setDate(new Date().getDate() + 7)));
</script>

<template>
    <div class="card flex flex-col gap-4 relative">
        <div id="button_" class="absolute top-4 right-10 flex gap-2 z-10">
            <Button label="입고등록" class="p-button-success px-6 py-3 text-lg font-bold" style="width: 100px; height: 50px" />
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="outordDate" class="flex items-center">입고일자</label>
            <div class="col-span-2">
                <DatePicker v-model="today" class="w-full" name="outordDate" dateFormat="yy-mm-dd" showIcon showButtonBar iconDisplay="input" inputId="icondisplay" />
            </div>
        </div>

        <div class="grid grid-cols-12 gap-2">
            <label for="outordNo" class="flex items-center">발주번호</label>
            <div class="col-span-2">
                <div class="grid grid-cols-[1fr_auto] gap-2">
                    <InputText v-model="outordNo" name="custCode" class="w-full" />
                    <Button @click="OutordmodalVisible = true" icon="pi pi-search" class="flex-none" style="width: 2.5rem; height: 2.5rem" />
                </div>
            </div>

            <Dialog v-model:visible="OutordmodalVisible" header="발주검색" modal style="width: 80vw; height: 80vh">
                <OutordSearchModal @register="handleCustRegister" />
                <!-- @select="handleCustSelect"-->
            </Dialog>
        </div>

        <div class="grid grid-cols-12 gap-2">
            <label for="custCode" class="flex items-center">거래처</label>
            <div class="col-start-2 col-end-7">
                <InputText v-model="custCode" type="text" class="w-full" readonly />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="custName" class="flex items-center">거래처명</label>
            <div class="col-start-2 col-end-7">
                <InputText v-model="custName" type="text" class="w-full" readonly />
            </div>
        </div>
        <div>
            <DataTable :value="selectedItems" v-model:selection="selectedRows" scrollable scrollHeight="55vh" style="height: 60vh; border: 1px solid #ddd">
                <Column selectionMode="multiple" style="width: 3rem"></Column>
                <Column field="ITEM_CODE" header="자재코드" sortable style="min-width: 5em"></Column>
                <Column field="ITEM_NAME" header="자재명" sortable style="min-width: 10em"></Column>
                <Column field="SPEC" header="규격" sortable style="min-width: 10em"></Column>
                <Column field="UNIT" header="단위" sortable style="min-width: 3em"></Column>
                <Column field="OUTORD_QTY" header="발주량" sortable style="min-width: 3em"> </Column>
                <Column field="INPUT_QTY" header="입고량" sortable style="min-width: 3em">
                    <template #body="{ data }">
                        <input v-model.number="data.INPUT_QTY" type="number" min="0" step="1" class="w-24 border p-1" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <!-- </div> -->
</template>
