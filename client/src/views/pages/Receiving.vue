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

// //✅ 엔터키 처리함수
// const handleLotNoEnter = () => {
//     if (!inputLotNo.value) {
//         toast.add({ severity: 'warn', summary: '안내', detail: 'LOT번호를 입력하세요.' });
//     }
//     getScanData(inputLotNo.value);
// };

// ✅ 조회 함수
// const getScanData = async (lotNo) => {
//     //console.log('🌐 서버 요청 보냄', code, revision, name);
//     let result = await axios
//         .get(`${apiUrl}/receiving?`, {
//             params: {
//                 lotNo: lotNo.value,
//                 itemCode: itemCode.value,
//                 itemName: itemName.value,
//                 lotQty: lotQty.value
//             }
//         })
//         .catch((err) => {
//             console.error('제품 조회 실패:', err);
//             selectLot.value = result.data;
//         });
//     receiving.value = result.data;
// };
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
                <div class="font-semibold">
                    지금 어떤 공정에서 확인하는지가 애매함, lot_history테이블에서 이전 공정이 있고 그 다음 공정에서 찍으면 여기가 맞다 아니다 판별 가능할 것 같은데 내일 한번 물어보고 이부분은 다시 작성해야함, 사용여부, 출고상태는 바로 판별 가능,
                </div>
            </div>
        </div>
    </div>
</template>
