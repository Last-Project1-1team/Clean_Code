<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { ref, computed, toRaw, unref } from 'vue';
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
const matchedlot = ref([]);
const matchedinord = ref([]);
const scanbox = ref([]);
const LotNo = ref([]);
const merged = ref([]);
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
    console.log('수주업체: ', result);
    customers.value = result.data[0].cust_name;
    inordlist.value = result.data;
    console.log('inordlist:', inordlist.value);
    console.log('inordlist.value.CUST_CODE', inordlist.value[0].CUST_CODE);
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
    console.log('result1: ', result1);
    lotNolist.value = result1.data;
    console.log('lotNolist: ', lotNolist.value);
    // console.log('selectedmodel.value', selectedmodel.value);
    // console.log('selectedRows.value', selectedRows.value);

    const shipcheck = inordlist.value.some((inordno) => lotNolist.value.some((lotno) => lotno.MODEL_CODE === inordno.MODEL_CODE || lotno.REVISION === inordno.REVISION));
    console.log('일치확인: ', shipcheck);

    matchedlot.value = lotNolist.value.filter((lot) => inordlist.value.some((inord) => inord.MODEL_CODE === lot.MODEL_CODE || inord.REVISION === lot.REVISION));
    matchedinord.value = inordlist.value.filter((inord) => lotNolist.value.some((lot) => lot.MODEL_CODE === inord.MODEL_CODE || lot.REVISION === inord.REVISION));
    console.log('matchedlot.value: ', matchedlot.value);
    console.log('matchedinord.value: ', matchedinord.value);
    // selectedmodel.value = matchedlot.value;
    selectedmodel.value.push(...matchedlot.value);

    merged.value = inordlist.value
        .map((inord) => {
            const matched = lotNolist.value.find((lot) => lot.MODEL_CODE === inord.MODEL_CODE || lot.REVISION === inord.REVISION);
            return matched ? { ...inord, ...matched } : null;
        })
        .filter(Boolean);

    console.log('merged: ', merged.value);

    const prodLotNos = merged.value.map((item) => item.PROD_LOT_NO);
    console.log('prodLotNos: ', prodLotNos);

    if (shipcheck == false) {
        toast.add({ severity: 'error', summary: ' 수주서에 일치하는 값이 없음.', life: 3000 });
        return;
    }
};

const onSave = async () => {
    if (selectedmodel.value == '') {
        toast.add({ severity: 'error', summary: '제품 정보가 없습니다.', life: 3000 });
        return;
    }

    const payload = {
        ships: merged.value.map((ship) => ({
            custcode: ship.CUST_CODE,
            inordno: ship.INORD_NO,
            prodlotno: ship.PROD_LOT_NO,
            lotno: ship.LOT_NO,
            lotpqty: ship.LOT_QTY,
            modelcode: ship.MODEL_CODE,
            revision: ship.REVISION
        }))
    };
    console.log('payload:', payload);
    try {
        const response = await axios.post(`${apiUrl}/insertship`, payload);
        toast.add({ severity: 'success', summary: '출하가 등록되었습니다.', life: 3000 });
        selectedmodel.value = [];
        selectedRows.value = [];
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: '저장 중 오류가 발생했습니다.', life: 3000 });
    }
};

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
            <Column field="PROD_LOT_NO" header="Lot.No" sortable style="width: 15em"></Column>
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
