<script setup>
import axios from 'axios';
import Dialog from 'primevue/dialog';
import { ref, watch } from 'vue';
import { onBeforeMount, shallowRef, computed } from 'vue'; //반응형 객체

// 1) 데이터가 필요
const custList = shallowRef([]); // <- 반응형 객체
const count = computed(() => {
    return custList.value.length;
});

// VueRouter 사용
import { useRouter } from 'vue-router';
const router = useRouter();
const goToDetail = (custNo) => {
    router.push({ name: 'custInfo', params: { cno: custNo } });
};

// 2) server로부터 데이터 가져오기 => axios API
const getBookList = async () => {
    let result = await axios.get('/api/custselect').catch((err) => console.log(err)); // 경로 풀네임이 api로 변경됨.
    custList.value = result.data;
};

// 3) 컴포넌트가 화면에 보여지기 직전에
// Server로부터 데이터를 가져오기
onBeforeMount(() => {
    getBookList();
});

const custmodal = defineModel('inordmodal', { type: Boolean });

const selectcust = ref([
    { CUST_CODE: 'CUST-0001', CUST_NAME: '업체1', PSCH_PHONE: '010-1234-5678' },
    { CUST_CODE: 'CUST-0002', CUST_NAME: '업체2', PSCH_PHONE: '010-1234-5678' },
    { CUST_CODE: 'CUST-0003', CUST_NAME: '업체3', PSCH_PHONE: '010-1234-5678' },
    { CUST_CODE: 'CUST-0004', CUST_NAME: '업체4', PSCH_PHONE: '010-1234-5678' },
    { CUST_CODE: 'CUST-0005', CUST_NAME: '업체5', PSCH_PHONE: '010-1234-5678' },
    { CUST_CODE: 'CUST-0006', CUST_NAME: '업체6', PSCH_PHONE: '010-1234-5678' },
    { CUST_CODE: 'CUST-0007', CUST_NAME: '업체7', PSCH_PHONE: '010-1234-5678' },
    { CUST_CODE: 'CUST-0008', CUST_NAME: '업체8', PSCH_PHONE: '010-1234-5678' },
    { CUST_CODE: 'CUST-0009', CUST_NAME: '업체9', PSCH_PHONE: '010-1234-5678' },
    { CUST_CODE: 'CUST-0010', CUST_NAME: '업체10', PSCH_PHONE: '010-1234-5678' }
]);

const selectedRows = ref([]);

// multiple 단일 선택 함수. 챗지피티가 만듬
watch(selectedRows, (v) => {
    if (v.length > 1) selectedRows.value = [v.at(-1)];
});
</script>

<template>
    <Dialog v-model:inordmodal="custmodal" modal header="업체" style="width: 50vw">
        <div class="grid grid-cols-10 gap-2">
            <label for="INORD_DATE" class="flex items-center">업체코드</label>
            <div class="col-span-2">
                <InputText id="PSCH_PHONE" type="text" class="w-full" />
            </div>
            <label for="PAPRD_DATE" class="flex items-center">업체명</label>
            <div class="col-span-2">
                <InputText id="PSCH_PHONE" type="text" class="w-full" />
            </div>
            <Button class="col-start-8" label="초기화"></Button>
            <Button class="col-start-9" label="등록"></Button>
            <Button class="col-start-10" label="조회"></Button>
        </div>
        <DataTable :value="selectcust" v-model:selection="selectedRows" selectionMode="multiple" scrollable scrollHeight="400px" style="height: 40vh; border: 1px solid #ddd">
            <Column field="CUST_CODE" header="업체코드" sortable style="min-width: 5em"></Column>
            <Column field="CUST_NAME" header="업체명" sortable style="min-width: 10em"></Column>
            <Column field="PSCH_PHONE" header="담당자연락처" sortable style="min-width: 3em"></Column>
        </DataTable>
    </Dialog>
</template>

<style></style>
