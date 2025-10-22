<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import itemSearchVue from '@/components/ItemSearchFromTo.vue';
import axios from 'axios';
// import { onBeforeMount, shallowRef, computed } from 'vue';
// import useDateUtils from '@/utils/useDates.js';

const outputItem = ref([]); // 모달에서 넘어온 데이터 저장
const selectedRows = ref([]);
const toast = useToast();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const handleSubmit = ({ code, name, lastdate, nextdate }) => {
    getOutput(itemCode, itemName, lastdate, nextdate);
};

const getOutput = async (itemcode, itemname, fromdate, todate) => {
    // ref() 또는 Date 객체 둘 다 처리
    const fromDate = fromdate?.value ?? fromdate;
    const toDate = todate?.value ?? todate;

    // ✅ Date 객체면 문자열(YYYY-MM-DD)로 변환
    const formatfromdate = fromDate instanceof Date ? fromDate.toISOString().slice(0, 10) : typeof fromDate === 'string' ? fromDate : '';

    const formattodate = toDate instanceof Date ? toDate.toISOString().slice(0, 10) : typeof toDate === 'string' ? toDate : '';

    try {
        const result = await axios.get(`${apiUrl}/itemoutput`, {
            params: {
                itemCode: itemcode.value || '',
                itemName: itemname.value || '',
                outputDatefr: formatfromdate,
                outputDateto: formattodate
            }
        });

        console.log('📥 결과:', result.data);
        outputItem.value = result.data;
    } catch (err) {
        console.error('출고 조회 실패:', err);
        outputItem.value = [];
    }
};
const formatNumber = (val) => {
    if (val == null || val === '') return '-';
    return Number(val).toLocaleString();
};

const totalOutQty = (outputDate) => {
    const items = outputItem.value.filter((i) => i.outputDate === outputDate);
    return items.reduce((sum, i) => sum + Number(i.outordQty || 0), 0);
};

const totalInQty = (outputDate) => {
    const items = outputItem.value.filter((i) => i.outputDate === outputDate);
    return items.reduce((sum, i) => sum + Number(i.inputQty || 0), 0);
};

// function getSeverity(status) {
//     switch (status) {
//         case '가입고':
//             return 'danger';

//         case '입고완료':
//             return 'success';

//         case '검사완료':
//             return 'info';
//     }
// }
</script>

<template>
    <div class="card flex flex-col gap-4 relative">
        <itemSearchVue @submit="handleSubmit" />
        <DataTable :value="outputItem" rowGroupMode="subheader" groupRowsBy="outputDate" sortMode="single" sortField="outputDate" :sortOrder="1" scrollHeight="70vh" tableStyle="min-width: 60rem">
            <!-- ✅ 그룹 헤더 (발주번호 + 거래처명) -->
            <template #groupheader="slotProps"
                ><div class="flex font-semibold w-full pr-4 py-2 text-gray-700">출고일자: {{ slotProps.data.outputDate }}</div>
            </template>

            <Column field="itemCode" header="자재코드" style="min-width: 8em" />
            <Column field="itemName" header="자재명" style="min-width: 10em" />
            <Column field="spec" header="규격" style="min-width: 8em" />
            <Column field="unit" header="단위" style="min-width: 5em; text-align: center" />
            <Column field="outputQty" header="출고수량" style="min-width: 6em; text-align: right" />
            <Column field="outStock" header="출고창고" style="min-width: 6em; text-align: right" />
            <Column field="status" header="출고상태" style="min-width: 6em; text-align: right" />
        </DataTable>
    </div>
    <!-- </div> -->
</template>
