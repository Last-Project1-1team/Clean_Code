<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import Dialog from 'primevue/dialog';
import OutordSearchModal from '@/components/OutordSearchModal.vue';
import CustSearchModal from '@/components/CustSearchModal.vue';
// import 제품모달창 from '';
// import 업체모달창 from '';
import axios from 'axios';
// import { onBeforeMount, shallowRef, computed } from 'vue';
// import useDateUtils from '@/utils/useDates.js';

const outordItems = ref([]); // 모달에서 넘어온 데이터 저장
const lotNo = ref(null);
const selectedRows = ref([]);
const itemCode = ref([]);
const itemName = ref([]);
const lotQty = ref([]);
const outputStock = ref([]);
const outputStocks = ref([]);
const products = ref();
const selectedStock = ref(null);
const filteredStock = ref([]);
const OutordmodalVisible = ref(false);
const toast = useToast();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
    ProductService.getProducts().then((data) => (products.value = data));
    const stockresult = await axios.get(`${apiUrl}/itemOutput/outputStock`);
    outputStocks.value = stockresult.data;
});

const searchStock = (event) => {
    const query = event.query.toLowerCase();
    filteredStock.value = outputStocks.value.filter((item) => item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query));
};

const onSave = async () => {
    const payload = {
        lotNo: lotNo.value,
        outputStock: outputStock.value,
        lotQty: lotQty.value
    };
    try {
        const response = await axios.post(`${apiUrl}/itemOutput`, payload);
        toast.add({ severity: 'success', summary: '출고가 저장되었습니다.', life: 3000 });
        lotNo.value = '';
        itemCode.value = '';
        itemName.value = '';
        lotQty.value = '';
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: '저장 중 오류가 발생했습니다.', life: 3000 });
    }
};

const onEnter = async () => {
    if (outputStock.value == '') {
        toast.add({ severity: 'error', summary: '출고창고를 먼저 선택해주세요.', life: 3000 });
        return;
    }
    if (lotNo.value == '') {
        toast.add({ severity: 'error', summary: 'LOTNO를 먼저 입력해주세요.', life: 3000 });
        return;
    }
    try {
        const response = await axios.get(`${apiUrl}/outputLot?lotNo=` + lotNo.value);
        console.log(response.data[0].itemCode);
        itemCode.value = response.data[0].itemCode;
        itemName.value = response.data[0].itemName;
        lotQty.value = response.data[0].lotQty;
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'LOTNO 정보 조회 중 오류가 발생했습니다.', life: 3000 });
    }
};

const today = ref(new Date()); // 오늘 날짜
</script>

<template>
    <div class="card flex flex-col gap-4 relative">
        <div id="button_" class="absolute top-4 right-10 flex gap-2 z-10">
            <div class="flex items-center" style="margin-right: 20px">
                <Checkbox id="autoOutput" name="autoOutput" value="Y" v-model="autoOutput" />
                <label for="autoOutput" class="ml-2">자동출고</label>
            </div>
            <Button label="저장" class="p-button-success px-6 py-3 text-lg font-bold" style="width: 100px; height: 50px" @click="onSave" />
            <Button label="조회" class="p-button-success px-6 py-3 text-lg font-bold" style="width: 100px; height: 50px" @click="onSearch" />
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="itemOutputDate" class="flex items-center">출고일자</label>
            <div class="col-span-2">
                <DatePicker v-model="today" class="w-full" name="itemOutputDate" dateFormat="yy-mm-dd" showIcon showButtonBar iconDisplay="input" inputId="icondisplay" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="outputStock" class="flex items-center">출고창고</label>
            <AutoComplete class="col-span-3" v-model="outputStock" :suggestions="filteredStock" @complete="searchStock" optionLabel="name" dropdown display="chip" />
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="lotNo" class="flex items-center">LOTNO</label>
            <div class="col-start-2 col-end-7">
                <InputText v-model="lotNo" type="text" class="w-full" @keydown.enter="onEnter" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="lotNo" class="flex items-center">자재코드</label>
            <div class="col-start-2 col-end-4">
                <InputText v-model="itemCode" type="text" class="w-full" readonly />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="lotNo" class="flex items-center">자재명</label>
            <div class="col-start-2 col-end-7">
                <InputText v-model="itemName" type="text" class="w-full" readonly />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="custCode" class="flex items-center">출고수량</label>
            <div class="col-start-2 col-end-4">
                <InputText v-model="lotQty" type="text" class="w-full" />
            </div>
        </div>
        <div>
            <DataTable :value="outputItems" v-model:selection="selectedRows" scrollable scrollHeight="55vh" style="height: 60vh; border: 1px solid #ddd">
                <Column field="outputNo" header="출고번호" sortable style="min-width: 5em" @hidden="true"></Column>
                <Column field="itemCode" header="자재코드" sortable style="min-width: 5em"></Column>
                <Column field="itemName" header="자재명" sortable style="min-width: 10em"></Column>
                <Column field="spec" header="규격" sortable style="min-width: 10em"></Column>
                <Column field="unit" header="단위" sortable style="min-width: 3em"></Column>
                <Column field="lotNo" header="LOTNO" sortable style="min-width: 10em"></Column>
                <Column field="outputQty" header="출고수량" sortable style="min-width: 3em"> </Column>
                <Column field="status" header="상태구분" sortable style="min-width: 3em"> </Column>
            </DataTable>
        </div>
    </div>
    <!-- </div> -->
</template>
