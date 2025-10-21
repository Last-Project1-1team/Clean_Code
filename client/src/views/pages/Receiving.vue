<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const toast = useToast();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const selectLotInfo = ref('');
const lotInfo = reactive({
    lotNo: '',
    itemCode: '',
    itemName: '',
    lotQty: ''
});

const handleLotNoEnter = () => {
    if (!selectLotInfo.value.trim()) {
        console.warn('⚠️ LOT번호가 비어 있습니다.');
        return;
    }
    getScanData(selectLotInfo.value); // 여기서 입력값 파라미터로 전달
};

const getScanData = async (lotNo = '') => {
    try {
        console.log('📡 조회 요청:', lotNo);
        const result = await axios.get(`${apiUrl}/receiving`, {
            params: { lotNo }
        });
        console.log('✅ 조회 결과:', result.data);

        // 단건조회 결과일 때 그대로 넣기
        if (result.data) {
            lotInfo.lotNo = result.data.lotNo;
            lotInfo.itemCode = result.data.itemCode;
            lotInfo.itemName = result.data.itemName;
            lotInfo.lotQty = result.data.lotQty;
            lotInfo.location = result.data.location;
            lotInfo.status = result.data.status;
        }
    } catch (err) {
        console.error('Lot 조회 실패:', err);
    }
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
        <div class="w-[600px] mx-auto border border-gray-300 rounded-lg p-6 text-lg">
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
