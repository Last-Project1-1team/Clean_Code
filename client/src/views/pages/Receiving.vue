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
const receiving = ref('');

// ✅ 엔터키 처리 함수
const handleLotNoEnter = () => {
    if (!inputLotNo.value) {
        toast.add({ severity: 'warn', summary: '안내', detail: 'LOT번호를 입력하세요.' });
        return;
    }
};

// ✅ 조회 함수
const getScanData = async (lotNo, itemCode, itemName, lotQty) => {
    //console.log('🌐 서버 요청 보냄', code, revision, name);
    let result = await axios
        .get(`${apiUrl}/receiving?`, {
            params: {
                lotNo: lotNo.value,
                itemCode: itemCode.value,
                itemName: itemName.value,
                lotQty: lotQty.value
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
            <InputText v-model="selectLotInfo" placeholder="LOT번호를 스캔 또는 입력하세요" enter="handleToss" @keyup.enter="handleLotNoEnter" class="w-[400px] text-center p-inputtext-lg" />
            <Button label="입력" icon="pi pi-search" class="ml-3" enter="handleToss" @click="getScanData(selectLotInfo)" />
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
            <div class="grid grid-cols-2 border-b border-gray-300 p-10">
                <div class="font-semibold"></div>
            </div>
        </div>
    </div>
</template>
