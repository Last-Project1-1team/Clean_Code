<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import axios from 'axios';
</script>

<template>
    <div class="card flex flex-col gap-4 relative" style="height: 100vh">
        <div class="grid grid-cols-12 gap-2" style="height: 15vh">
            <div class="col-span-12">
                <InputText label="스캔" v-model="InordDate" class="w-full h-full" type="text" />
            </div>
        </div>
        <div style="height: 2vh"></div>

        <div class="grid grid-cols-12 gap-2" style="height: 8vh">
            <label for="INORD_DATE" class="flex justify-center items-center h-full w-full">수주번호</label>
            <div class="col-span-11">
                <InputText v-model="InordDate" class="w-full h-full" type="text" />
            </div>
        </div>

        <div class="grid grid-cols-12 gap-2" style="height: 8vh">
            <label for="PAPRD_DATE" class="flex justify-center items-center h-full w-full">고객사정보</label>
            <div class="col-span-11">
                <InputText v-model="PaprdDate" class="w-full h-full" type="text" />
            </div>
        </div>

        <!-- ✅ 삭제 버튼 (같은 줄 오른쪽 끝. end로 함) -->
        <div class="col-end-13 flex justify-end">
            <Button label="출하등록" class="p-button-success px-6 py-3 text-lg font-bold" style="width: 100px; height: 50px" @click="onSave" />
        </div>

        <DataTable :value="selectedmodel" v-model:selection="selectedRows" scrollable scrollHeight="400px" style="height: 40vh; border: 1px solid #ddd">
            <Column field="LOT_NUMBER" header="Lot.No" sortable style="min-width: 5em"></Column>
            <Column field="SHIP_DATE" header="출하일자" sortable style="min-width: 5em"></Column>
            <Column field="MODEL_CODE" header="제품코드" sortable style="min-width: 5em"></Column>
            <Column field="MODEL_NAME" header="제품명" sortable style="min-width: 10em"></Column>
            <Column field="SPEC" header="규격" sortable style="min-width: 10em"></Column>
            <Column field="UNIT" header="단위" sortable style="min-width: 3em"></Column>
            <Column field="INORD_QTY" header="수주량" sortable style="min-width: 3em">
                <template #body="{ data }">
                    <input v-model.number="data.INORD_QTY" type="number" min="0" step="1" class="w-24 border p-1" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
