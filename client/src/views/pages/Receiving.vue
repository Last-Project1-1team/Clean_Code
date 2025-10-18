<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import { Button } from 'primevue';

const toast = useToast();
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const inputLotNo = ref('');
const lotInfo = ref([]);
const receiving = ref([]);

const getInordList = async () => {
    let result = await axios
        .get(`${apiUrl}/customerNo?`, {
            params: {
                Code: InordScan.value
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

const handleLotNoEnter = () => {
    LotNoShow.value = LotNoScan.value; // 입력값을 복사해서 표시
    getLotNoScan();
};
// ✅ 스캔 (조회) 함수
const scanLot = async () => {
    try {
        const res = await axios.get(`${apiUrl}/receiving/${inputLotNo.value}`);

        const data = res.data;

        if (data.status === 'INVALID') {
            toast.add({ severity: 'error', summary: '오류', detail: data.message });
        } else if (data.status === 'NOT_FOUND') {
            toast.add({ severity: 'warn', summary: '미존재', detail: data.message });
        } else {
            lotInfo.value = data.data;
        }
    } catch (err) {
        console.error('스캔 오류:', err);
    }
};

// ✅ 조회 함수
const getScanData = async (lotNo, itemCode, itemName, lotQty) => {
    //console.log('🌐 서버 요청 보냄', code, revision, name);
    let result = await axios
        .get(`${apiUrl}/receiving?`, {
            params: {
                lotNo: lotNo || '',
                itemCode: itemCode || '',
                itemName: itemName || '',
                lotQty: lotQty || ''
            }
        })
        .catch((err) => {
            console.error('제품 조회 실패:', err);
            receiving.value = result.data;
        });
    receiving.value = result.data;
};
</script>
<template>
    <div class="p-4">
        <!-- 제목 -->
        <h1 class="text-center text-3xl font-bold mb-6">스캔</h1>

        <!-- LOT 입력창 -->
        <div class="flex justify-center mb-6">
            <InputText v-model="inputLotNo" placeholder="LOT번호를 스캔 또는 입력하세요" @keyup.enter="handleLotNoEnter" class="w-[400px] text-center p-inputtext-lg" />
            <Button label="조회" icon="pi pi-search" class="ml-3" @click="getScanData(inputLotNo.value)" />
        </div>

        <!-- LOT 정보 표시 영역 -->
        <div v-if="lotInfo" class="w-[600px] mx-auto border border-gray-300 rounded-lg p-6 text-lg">
            <div class="grid grid-cols-2 border-b border-gray-300 p-10">
                <div class="font-semibold">LOT번호</div>
                <div>{{ lotInfo.lotNo }}</div>
            </div>
            <div class="grid grid-cols-2 border-b border-gray-300 p-10">
                <div class="font-semibold">품번</div>
                <div>{{ lotInfo.itemCode }}</div>
            </div>
            <div class="grid grid-cols-2 border-b border-gray-300 p-10">
                <div class="font-semibold">품명</div>
                <div>{{ lotInfo.itemName }}</div>
            </div>
            <div class="grid grid-cols-2 border-b border-gray-300 p-10">
                <div class="font-semibold">LOT수량</div>
                <div>{{ lotInfo.lotQty }}</div>
            </div>

            <!-- 오류 메시지 -->
            <div v-if="errorMessage" class="p-4 text-center text-red-600 font-bold">
                {{ errorMessage }}
            </div>
        </div>
    </div>
</template>
