<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import Dialog from 'primevue/dialog';
import ItemSearchModal from '@/components/ItemSearchModal.vue';
// import 제품모달창 from '';
// import 업체모달창 from '';
// import axios from 'axios';
// import { onBeforeMount, shallowRef, computed } from 'vue';
// import useDateUtils from '@/utils/useDates.js';

const selectedItems = ref([]); // 모달에서 넘어온 데이터 저장

const modalVisible = ref(false);

const handleItemRegister = (items) => {
    // 부모 테이블에 추가 (기존 데이터 유지 + 신규 추가)
    const mapped = items
        .filter((item) => {
            // 이미 등록된 ITEM_CODE는 제외
            return !selectedItems.value.some((si) => si.ITEM_CODE === item.itemCode);
        })
        .map((item) => ({
            ITEM_CODE: item.itemCode,
            ITEM_NAME: item.itemName,
            SPEC: item.spec,
            UNIT: item.unitName,
            OUTORD_QTY: item.outOrdQty
        }));

    selectedItems.value = [...selectedItems.value, ...mapped];
    modalVisible.value = false; // 모달 닫기
};
const onDelete = () => {
    selectedItems.value = selectedItems.value.filter((item) => !selectedRows.value.includes(item));
    selectedRows.value = [];
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
            <Button label="저장" class="p-button-success px-6 py-3 text-lg font-bold" style="width: 100px; height: 50px" @click="onSave" />
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="outordDate" class="flex items-center">발주일자</label>
            <div class="col-span-2">
                <DatePicker v-model="today" class="w-full" name="outordDate" dateFormat="yy-mm-dd" showIcon showButtonBar iconDisplay="input" inputId="icondisplay" />
            </div>
            <!-- <Message v-if="$form.date?.invalid" severity="error" size="small" variant="simple">{{ $form.date.error?.message }}</Message> -->
        </div>

        <div class="grid grid-cols-12 gap-2">
            <label for="custCode" class="flex items-center">거래처</label>
            <div class="col-span-2">
                <div class="grid grid-cols-[1fr_auto] gap-2">
                    <InputText v-model="custcode" name="custCode" class="w-full" />
                    <Button @click="custopen = true" icon="pi pi-search" class="flex-none" style="width: 2.5rem; height: 2.5rem" />
                </div>
            </div>
        </div>

        <div class="grid grid-cols-12 gap-2">
            <label for="custName" class="flex items-center">거래처명</label>
            <div class="col-start-2 col-end-7">
                <InputText id="custName" name="custName" type="text" class="w-full" readonly />
            </div>
        </div>

        <div class="grid grid-cols-12 gap-2">
            <label for="deliveryDate" class="flex items-center">납기요청일</label>
            <div class="col-span-2">
                <DatePicker v-model="selectedDate" class="w-full" name="deliveryDate" dateFormat="yy-mm-dd" showIcon showButtonBar iconDisplay="input" inputId="icondisplay" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2 items-center">
            <label for="itemCode" class="flex items-center col-span-1">자재코드</label>
            <div class="col-span-2">
                <div class="grid grid-cols-[1fr_auto] gap-2">
                    <InputText v-model="itemCode" name="itemCode" class="w-full" />
                    <Button @click="modalVisible = true" icon="pi pi-search" class="flex-none" style="width: 2.5rem; height: 2.5rem" />
                </div>
            </div>

            <!-- ✅ 삭제 버튼 (같은 줄 오른쪽 끝) -->
            <div class="col-span-9 flex justify-end">
                <Button label="삭제" icon="pi pi-trash" class="p-button-danger px-4 py-2 font-bold" @click="onDelete" style="width: 100px" />
            </div>

            <Dialog v-model:visible="modalVisible" header="자재 검색" modal style="width: 80vw; height: 80vh">
                <ItemSearchModal @select="handleItemSelect" @register="handleItemRegister" />
            </Dialog>
        </div>
        <!-- <div class="card flex flex-col gap-4"> -->
        <!-- <div class="grid grid-cols-12 gap-2">
            <label for="itemCode" class="flex items-center">자재코드</label>
            <div class="col-span-2">
                <div class="grid grid-cols-[1fr_auto] gap-2">
                    <InputText v-model="itemCode" name="itemCode" class="w-full" />
                    <Button @click="modalVisible = true" icon="pi pi-search" class="flex-none" style="width: 2.5rem; height: 2.5rem" />
                </div>
                <Dialog v-model:visible="modalVisible" header="자재 검색" modal style="width: 80vw; height: 80vh">
                    <ItemSearchModal @select="handleItemSelect" @register="handleItemRegister" />
                </Dialog>
            </div>
            <div class="col-span-8 flex justify-end gap-2">
                <Button label="삭제" icon="pi pi-trash" class="p-button-danger px-4 py-4 font-bold" @click="onDelete" />
            </div>
        </div> -->
        <div>
            <DataTable :value="selectedItems" v-model:selection="selectedRows" scrollable scrollHeight="55vh" style="height: 55vh; border: 1px solid #ddd">
                <Column selectionMode="multiple" style="width: 3rem"></Column>
                <Column field="ITEM_CODE" header="자재코드" sortable style="min-width: 5em"></Column>
                <Column field="ITEM_NAME" header="자재명" sortable style="min-width: 10em"></Column>
                <Column field="SPEC" header="규격" sortable style="min-width: 3em"></Column>
                <Column field="UNIT" header="단위" sortable style="min-width: 3em"></Column>
                <!-- 수주량 인풋박스 -->
                <Column field="OUTORD_QTY" header="발주량" sortable style="min-width: 3em">
                    <template #body="{ data }">
                        <input v-model.number="data.OUTORD_QTY" type="number" min="0" step="1" class="w-24 border p-1" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <!-- </div> -->
</template>
