<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import axios from 'axios';

const selectedmodel = ref([]);
const InordScan = ref([]);
const InordShow = ref([]);
const lotScan = ref('');
const PaprdDate = ref([]);
const customers = ref([]);
const inordlist = ref([]);
const revision = ref([]);
const lotNolist = ref([]);
const scanbox = ref([]);
const LotNo = ref([]);
const selectedRows = ref([]);
const toast = useToast();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const getInordList = async () => {
    let result = await axios
        .get(`${apiUrl}/customerNo?`, {
            params: {
                inordCode: InordScan.value
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

//생산lot조회
const getLotList = async () => {
    let result1 = await axios
        .get(`${apiUrl}/lotNo?`, {
            params: {
                LotNo: lotScan.value
            }
        })
        .catch((err) => {
            console.error('LOT번호 조회 실패:', err);
            customers.value = [];
        });
    console.log(result1.data);
    lotNolist.value = result1.data;
    // console.log(result.data[0].cust_name);
};

//수주 lot 비교
const shipList = async () => {
    const inordlisttest = inordlist.value.map((u) => ({
        MODEL_CODE: u.MODEL_CODE,
        REVISION: u.REVISION
    }));
    console.log(inordlisttest);
    // const shiplist = lotNolist.value.filter((lotno) => inordlisttest.some((inordno) => inordno.MODEL_CODE === lotno.MODEL_CODE || inordno.REVISION === lotno.REVISION));
    const shiplist = lotNolist.value.filter((lotno) => inordlisttest.some((inordno) => lotno.MODEL_CODE === inordno.MODEL_CODE || lotno.REVISION === inordno.REVISION));
    console.log(shiplist);

    if (shiplist.length == 0) {
        toast.add({ severity: 'error', summary: ' 수주서에 일치하는 값이 없음.', life: 3000 });
        return;
    }
    // selectedmodel.value = shiplist;
    selectedmodel.value.push(...shiplist);
};

//제품명, 규격, 단위 가져오기

//
//
//
const handleInordEnter = () => {
    InordShow.value = InordScan.value; // 입력값을 복사해서 표시
    getInordList();
    if (lotNolist.value.length == 0) {
        toast.add({ severity: 'error', summary: '생산LOT를 스캔해주세요.', life: 3000 });
        return;
    }
    shipList();
};

const handleLotEnter = async () => {
    if (!inordlist.value.length) {
        toast.add({ severity: 'error', summary: '수주정보를 스캔해주세요.', life: 3000 });
        return;
    }
    await getLotList();
    shipList();
    // modellist();
};
</script>

<template>
    <div class="card flex flex-col gap-4 relative" style="height: 100vh">
        <div class="grid grid-cols-12 gap-2" style="height: 15vh">
            <div class="col-span-12">
                <InputText label="수주스캔" v-model="InordScan" class="w-full h-full" type="text" style="font-size: 40px" enter="handleToss" @keyup.enter="handleInordEnter" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2" style="height: 15vh">
            <div class="col-span-12">
                <InputText label="LOT스캔" v-model="lotScan" class="w-full h-full" type="text" style="font-size: 40px" enter="handleToss" @keyup.enter="handleLotEnter" />
            </div>
        </div>
        <div style="height: 2vh"></div>

        <div class="grid grid-cols-12 gap-2" style="height: 8vh">
            <label for="INORD_DATE" class="flex justify-center items-center h-full w-full">수주번호</label>
            <div class="col-span-11">
                <InputText v-model="InordShow" class="w-full h-full" type="text" />
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
            <Column field="MODEL_CODE" header="제품코드" sortable style="min-width: 5em"></Column>
            <Column field="MODEL_NAME" header="제품명" sortable style="min-width: 10em"></Column>
            <Column field="SPEC" header="규격" sortable style="min-width: 10em"></Column>
            <Column field="UNIT" header="단위" sortable style="min-width: 3em"></Column>
            <Column field="LOT_QTY" header="LOT수량" sortable style="min-width: 3em">
                <template #body="{ data }">
                    <input v-model.number="data.LOT_QTY" type="number" min="0" step="1" class="w-24 border p-1" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
