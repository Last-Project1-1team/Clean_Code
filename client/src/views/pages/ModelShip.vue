<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import axios from 'axios';

const selectedmodel = ref([]);
const InordDate = ref([]);
const InordDateshow = ref([]);
const PaprdDate = ref([]);
const customers = ref([]);
const inordlist = ref([]);
const revision = ref([]);
const scanbox = ref([]);
const LotNo = ref([]);
const toast = useToast();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const getInordList = async () => {
    let result = await axios
        .get(`${apiUrl}/customerNo?`, {
            params: {
                inordCode: InordDate.value
            }
        })
        .catch((err) => {
            console.error('수주 조회 실패:', err);
            customers.value = [];
        });
    console.log(result);
    customers.value = result.data[0].cust_name;
    inordlist.value = result.data;
    // console.log(result.data[0].cust_name);
};

// const getLotNoList = async () => {
//     let result = await axios
//         .get(`${apiUrl}/customerNo?`, {
//             params: {
//                 inordCode: InordDate.value
//             }
//         })
//         .catch((err) => {
//             console.error('수주 조회 실패:', err);
//             customers.value = [];
//         });
//     console.log(result);
//     customers.value = result.data[0].cust_name;
//     inordlist.value = result.data;
//     // console.log(result.data[0].cust_name);
// };

const handleEnter = () => {
    InordDateshow.value = InordDate.value; // 입력값을 복사해서 표시
    getInordList();
    if (inordlist.value == '') {
        toast.add({ severity: 'error', summary: '생산LOT를 선택해주세요.', life: 3000 });
        return;
    }
};
</script>

<template>
    <div class="card flex flex-col gap-4 relative" style="height: 100vh">
        <div class="grid grid-cols-12 gap-2" style="height: 15vh">
            <div class="col-span-12">
                <InputText label="수주스캔" v-model="InordDate" class="w-full h-full" type="text" style="font-size: 40px" enter="handleToss" @keyup.enter="handleEnter" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2" style="height: 15vh">
            <div class="col-span-12">
                <InputText label="LOT스캔" v-model="lotScan" class="w-full h-full" type="text" style="font-size: 40px" enter="handleToss" @keyup.enter="handleEnter" />
            </div>
        </div>
        <div style="height: 2vh"></div>

        <div class="grid grid-cols-12 gap-2" style="height: 8vh">
            <label for="INORD_DATE" class="flex justify-center items-center h-full w-full">수주번호</label>
            <div class="col-span-11">
                <InputText v-model="InordDateshow" class="w-full h-full" type="text" />
            </div>
        </div>

        <div class="grid grid-cols-12 gap-2" style="height: 8vh">
            <label for="PAPRD_DATE" class="flex justify-center items-center h-full w-full">고객사정보</label>
            <div class="col-span-11">
                <InputText v-model="customers" class="w-full h-full" type="text" />
            </div>
        </div>

        <!-- ✅ 삭제 버튼 (같은 줄 오른쪽 끝. end로 함) -->
        <div class="col-end-13 flex justify-end">
            <Button label="출하등록" class="p-button-success px-6 py-3 text-lg font-bold" style="width: 100px; height: 50px" @click="onSave" />
        </div>

        <DataTable :value="selectedmodel" v-model:selection="selectedRows" scrollable scrollHeight="400px" style="height: 40vh; border: 1px solid #ddd">
            <Column field="LOT_NUMBER" header="Lot.No" sortable style="width: 15em"></Column>
            <Column field="SHIP_DATE" header="출하일자" sortable style="width: 5em"> </Column>
            <Column field="MODEL_CODE" header="제품코드" sortable style="min-width: 5em"></Column>
            <Column field="MODEL_NAME" header="제품명" sortable style="min-width: 10em"></Column>
            <Column field="SPEC" header="규격" sortable style="min-width: 10em"></Column>
            <Column field="UNIT" header="단위" sortable style="min-width: 3em"></Column>
            <Column field="INORD_QTY" header="수주량" sortable style="min-width: 3em">
                <template #body="{ data }">
                    <input v-model.number="data.INORD_QTY" type="number" min="0" step="1" class="w-24 border p-1" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
