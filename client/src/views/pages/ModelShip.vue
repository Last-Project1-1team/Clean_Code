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
    // console.log('lot번호 : ', lotScan.value);
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
    // console.log('lot제품리비전lot수당:', result1.data);
    lotNolist.value = result1.data;
    console.log(result1.data);
};

//수주 lot 비교
const shipList = async () => {
    // console.log('수주제품리비전: ', inordlist.value);

    const shipcheck = inordlist.value.some((inordno) => lotNolist.value.some((lotno) => lotno.MODEL_CODE === inordno.MODEL_CODE || lotno.REVISION === inordno.REVISION));
    console.log('일치확인: ', shipcheck);

    if (shipcheck == false) {
        toast.add({ severity: 'error', summary: ' 수주서에 일치하는 값이 없음.', life: 3000 });
        return;
    }
    const shiplist = inordlist.value.filter((inordno) => lotNolist.value.some((lotno) => lotno.MODEL_CODE === inordno.MODEL_CODE || lotno.REVISION === inordno.REVISION));
    console.log('출하리스트: ', shiplist);
    selectedmodel.value = shiplist;
    selectedmodel.value.forEach((item) => {
        item.LOT_NUMBER = lotScan.value;
    });
};
//제품정보조회
const getModelList = async () => {
    const modellist = await axios
        .get(`${apiUrl}/modelno?`, {
            params: {
                modelNo: selectedmodel.value.map((model) => model.MODEL_CODE)
            }
        })
        .catch((err) => {
            console.error('제품정보 조회 실패:', err);
        });
    console.log('제품정보리스트:', modellist.data);
    // selectedmodel.value = modellist.data;
};
//
//
const handleInordEnter = () => {
    InordShow.value = InordScan.value; // 입력값을 복사해서 표시
    getInordList();
};

const handleLotEnter = async () => {
    if (!inordlist.value.length) {
        toast.add({ severity: 'error', summary: '수주정보를 스캔해주세요.', life: 3000 });
        return;
    }
    await getLotList();
    await shipList();
    // await getModelList();
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
