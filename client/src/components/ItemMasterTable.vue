<template>
    <div>
        <DataTable :value="itemMaster" scrollable scrollHeight="40vh" class="custom-table" style="height: 40vh; border: 1px solid #ddd">
            <Column field="itemCode" header="자재코드" style="min-width: 150px" frozen />
            <Column field="itemName" header="자재명" style="min-width: 200px" />
            <Column field="spec" header="상세규격" style="min-width: 400px" />
            <Column field="itemClassName" header="자재분류" style="min-width: 100px" />
            <Column field="unitName" header="단위" style="min-width: 50px" />
            <Column field="lotPQty" header="LOT당 수량" style="min-width: 100px" />
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const itemMaster = ref([
    { itemCode: 'ITEM-1001', itemName: '자재명1', spec: '규격1-100ml', itemClassName: '화학', unitName: 'EA', lotPQty: 50 },
    { itemCode: 'ITEM-1002', itemName: '자재명2', spec: '규격2-200ml', itemClassName: '포장재', unitName: 'BOX', lotPQty: 30 },
    { itemCode: 'ITEM-1003', itemName: '자재명3', spec: '규격3-300ml', itemClassName: '원료', unitName: 'KG', lotPQty: 80 },
    { itemCode: 'ITEM-1004', itemName: '자재명4', spec: '규격4-400ml', itemClassName: '전자부품', unitName: 'SET', lotPQty: 20 },
    { itemCode: 'ITEM-1005', itemName: '자재명5', spec: '규격5-500ml', itemClassName: '기계', unitName: 'L', lotPQty: 15 }
]);
</script>

<style scoped>
/* 데이터 셀만 글자 크기 줄이기 */
:deep(.custom-table .p-datatable-tbody > tr > td) {
    font-size: 1rem !important;
    padding: 4px 8px;
}
</style>
