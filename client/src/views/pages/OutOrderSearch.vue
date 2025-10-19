<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import OutOrderSearchVue from '@/components/OutordSearchFromTo.vue';
import axios from 'axios';
// import { onBeforeMount, shallowRef, computed } from 'vue';
// import useDateUtils from '@/utils/useDates.js';

const outorderItem = ref([]); // 모달에서 넘어온 데이터 저장
const selectedRows = ref([]);
const toast = useToast();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const handleSubmit = ({ lastdate, nextdate }) => {
    getOutord(lastdate, nextdate);
};

const getOutord = async (fromdate, todate) => {
    // ref() 또는 Date 객체 둘 다 처리
    const fromDate = fromdate?.value ?? fromdate;
    const toDate = todate?.value ?? todate;

    // ✅ Date 객체면 문자열(YYYY-MM-DD)로 변환
    const formatfromdate = fromDate instanceof Date ? fromDate.toISOString().slice(0, 10) : typeof fromDate === 'string' ? fromDate : '';

    const formattodate = toDate instanceof Date ? toDate.toISOString().slice(0, 10) : typeof toDate === 'string' ? toDate : '';

    try {
        const result = await axios.get(`${apiUrl}/outorder`, {
            params: {
                fromDate: formatfromdate,
                toDate: formattodate
            }
        });

        console.log('📥 결과:', result.data);
        outorderItem.value = result.data;
    } catch (err) {
        console.error('발주 조회 실패:', err);
        outorderItem.value = [];
    }
};
const formatNumber = (val) => {
    if (val == null || val === '') return '-';
    return Number(val).toLocaleString();
};

const totalOutQty = (outordNo) => {
    const items = outorderItem.value.filter((i) => i.outordNo === outordNo);
    return items.reduce((sum, i) => sum + Number(i.outordQty || 0), 0);
};

const totalInQty = (outordNo) => {
    const items = outorderItem.value.filter((i) => i.outordNo === outordNo);
    return items.reduce((sum, i) => sum + Number(i.inputQty || 0), 0);
};
</script>

<template>
    <div class="card flex flex-col gap-4 relative">
        <OutOrderSearchVue @submit="handleSubmit" />
        <DataTable :value="outorderItem" rowGroupMode="subheader" groupRowsBy="outordNo" sortMode="single" sortField="outordNo" :sortOrder="1" scrollHeight="70vh" tableStyle="min-width: 60rem">
            <!-- ✅ 그룹 헤더 (발주번호 + 거래처명) -->
            <template #groupheader="slotProps"
                ><div class="flex font-semibold w-full pr-4 py-2 text-gray-700">발주번호: {{ slotProps.data.outordNo }}</div>
            </template>

            <Column field="outordDate" header="발주일자" style="min-width: 8em" />
            <Column field="itemCode" header="자재코드" style="min-width: 10em" />
            <Column field="itemName" header="자재명" style="min-width: 10em" />
            <Column field="spec" header="규격" style="min-width: 8em" />
            <Column field="unit" header="단위" style="min-width: 5em; text-align: center" />
            <Column field="outordQty" header="발주수량" style="min-width: 6em; text-align: right">
                <template #body="{ data }">{{ formatNumber(data.outordQty) }}</template>
            </Column>
            <Column field="inputQty" header="입고수량" style="min-width: 6em; text-align: right">
                <template #body="{ data }">{{ formatNumber(data.inputQty) }}</template>
            </Column>
        </DataTable>
    </div>
    <!-- </div> -->
</template>
