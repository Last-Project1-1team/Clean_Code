<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const toast = useToast();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const errorMessage = ref('');
const selectLotInfo = ref('');
const lotInfo = ref({
    lotNo: '',
    itemCode: '',
    itemName: '',
    lotQty: '',
    location: '',
    status: '',
    locationName: ''
});

const handleLotNoEnter = () => {
    if (!selectLotInfo.value.trim()) {
        console.warn('LOT번호가 비어 있습니다.');
        return;
    }
    getScanData(selectLotInfo.value); // 여기서 입력값 파라미터로 전달
};

const getScanData = async (lotNo = '') => {
    try {
        const result = await axios.get(`${apiUrl}/receiving`, {
            params: { lotNo }
        });
        if (result.data) {
            lotInfo.value = {
                lotNo: result.data.lotNo,
                itemCode: result.data.itemCode,
                itemName: result.data.itemName,
                lotQty: result.data.lotQty,
                location: result.data.location,
                status: result.data.status,
                locationName: result.data.locationName
            };

            // 조건 체크
            if (lotInfo.value.location == '0H01') {
                errorMessage.value = '출고되지 않은 LOT입니다!';
            } else if (lotInfo.value.status !== '5') {
                errorMessage.value = '이미 공정 입고된 LOT입니다!';
            } else {
                // 정상 LOT
                errorMessage.value = '정상 LOT입니다!';
                await axios.post(`${apiUrl}/receiving/update`, { lotNo: lotInfo.value.lotNo });
            }
        }
    } catch (err) {
        console.error('Lot 조회 실패:', err);
        errorMessage.value = 'LOT 조회 중 오류가 발생했습니다.';
    }
    selectLotInfo.value = '';
};
</script>
<template>
    <div class="card" style="height: 87vh">
        <!-- LOT 입력창 -->
        <div class="flex justify-center mb-6">
            <InputText v-model="selectLotInfo" placeholder="LOT번호를 스캔 또는 입력하세요" enter="handleToss" @keyup.enter="handleLotNoEnter" class="w-[480px] text-center p-inputtext-lg" />
            <Button label="입력" icon="pi pi-search" class="buttons p-button-success px-6 py-3 text-lg font-bold" enter="handleToss" @click="getScanData(selectLotInfo)" />
        </div>

        <!-- LOT 정보 표시 영역 -->
        <div class="w-[600px] mx-auto border border-gray-300 rounded-lg p-6 text-3xl">
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
                <div class="font-semibold">현재위치</div>
                <div>{{ lotInfo.locationName }}</div>
            </div>

            <div class="grid grid-cols-1 border-b border-gray-300 p-10 text-center">
                <span v-if="errorMessage" class="text-red-600 font-bold text-3xl">
                    {{ errorMessage }}
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.buttons {
    margin-left: 10px;
}
</style>
