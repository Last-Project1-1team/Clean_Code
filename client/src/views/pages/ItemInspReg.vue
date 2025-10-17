<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import Dialog from 'primevue/dialog';
import ItemMasterSearchSaveVue from '@/components/ItemMasterSearchSave.vue';
import CustSearchModal from '@/components/CustSearchModal.vue';
// import 제품모달창 from '';
// import 업체모달창 from '';
import axios from 'axios';
// import { onBeforeMount, shallowRef, computed } from 'vue';
// import useDateUtils from '@/utils/useDates.js';

const itemInsps = ref([]);
const inputItems = ref([]); // 모달에서 넘어온 데이터 저장
const selectedRows = ref([]);
const toast = useToast();
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const selectedInspRows = ref([]);

const inspResultMessage = computed(() => {
    if (itemInsps.value.length === 0) return '검사 대기 중';

    const allOK = itemInsps.value.every((i) => i.judgment === 'OK');
    const anyNG = itemInsps.value.some((i) => i.judgment === 'NG');

    if (allOK) return '합격';
    if (anyNG) return '불합격';
    return '검사 중';
});

const handleSubmit = (item) => {
    getInputList(item.code, item.name);
};

const getInputList = async (code, name) => {
    let result = await axios
        .get(`${apiUrl}/inputList?`, {
            params: {
                status: 0,
                itemCode: code || '',
                itemName: name || ''
            }
        })
        .catch((err) => {
            console.error('아이템 조회 실패:', err);
            inputItems.value = [];
        });
    console.log(result.data);
    inputItems.value = result.data;
};

const handleSave = () => {
    saveInspResult();
};

const saveInspResult = async () => {
    if (!selectedRows.value || selectedRows.value.length === 0) {
        toast.add({ severity: 'warn', summary: '입고 항목을 먼저 선택해주세요.', life: 3000 });
        return;
    }

    if (itemInsps.value.length === 0) {
        toast.add({ severity: 'warn', summary: '검사 항목이 없습니다.', life: 3000 });
        return;
    }

    const inputNo = selectedRows.value.inputNo;

    const result = inspResultMessage.value === '합격' ? 'OK' : inspResultMessage.value === '불합격' ? 'NG' : null;

    if (!result) {
        toast.add({ severity: 'warn', summary: '검사 결과가 확정되지 않았습니다.', life: 3000 });
        return;
    }

    const inspItems = itemInsps.value.map((insp) => ({
        inspCode: insp.inspCode,
        inspName: insp.inspName,
        inspSpec: insp.inspSpec,
        judgment: insp.judgment || null
    }));

    const payload = {
        inputNo,
        result,
        items: inspItems
    };

    console.log('📤 검사결과 저장 payload:', payload);

    try {
        const response = await axios.post(`${apiUrl}/inspResult`, payload);
        toast.add({ severity: 'success', summary: '검사결과가 저장되었습니다.', life: 3000 });
        getInputList('', '');
    } catch (error) {
        toast.add({ severity: 'error', summary: '저장 중 오류가 발생했습니다.', life: 3000 });
    }
};

const onSearch = async (row) => {
    const inspItem = row.data.itemCode;
    let result = await axios.get(`${apiUrl}/inspList?`, { params: { itemCode: inspItem } }).catch((err) => {
        console.error('아이템 조회 실패:', err);
    });
    console.log(result.data);
    itemInsps.value = result.data;
};
</script>

<template>
    <div class="card flex flex-col gap-4 relative">
        <ItemMasterSearchSaveVue @submit="handleSubmit" @toss="handleSave" />
        <Splitter style="height: 66vh" class="mb-8">
            <SplitterPanel :size="70" :minSize="50">
                <DataTable :value="inputItems" v-model:selection="selectedRows" dataKey="inputNo" selectionMode="single" scrollable scrollHeight="120vh" style="height: 77vh" :metaKeySelection="true" @rowSelect="onSearch">
                    <Column field="inputNo" header="입고번호" sortable style="min-width: 5em"></Column>
                    <Column field="inputDate" header="입고일자" sortable style="min-width: 5em"></Column>
                    <Column field="itemCode" header="자재코드" sortable style="min-width: 5em"></Column>
                    <Column field="itemName" header="자재명" sortable style="min-width: 10em"></Column>
                    <Column field="inputQty" header="입고량" sortable style="min-width: 3em"></Column>
                </DataTable>
            </SplitterPanel>
            <SplitterPanel :size="70">
                <Splitter layout="vertical">
                    <SplitterPanel :size="70">
                        <DataTable :value="itemInsps" v-model:selection="selectedInspRows" scrollable scrollHeight="120vh" style="height: 77vh">
                            <Column field="inspCode" header="검사코드" sortable style="min-width: 5em"></Column>
                            <Column field="inspName" header="검사명" sortable style="min-width: 5em"></Column>
                            <Column field="inspSpec" header="규격" sortable style="min-width: 10em"></Column>
                            <Column field="insptResult" header="판정결과" sortable style="min-width: 5em">
                                <template #body="{ data }">
                                    <RadioButton :inputId="`ok-${data.inspName}`" :name="`judgment-${data.inspName}`" value="OK" v-model="data.judgment" @change="onChange" />
                                    <label :for="`ok-${data.inspName}`" class="ml-1 text-sm">OK</label>
                                    <RadioButton :inputId="`ng-${data.inspName}`" :name="`judgment-${data.inspName}`" value="NG" v-model="data.judgment" @change="onChange" style="margin-left: 10px" />
                                    <label :for="`ng-${data.inspName}`" class="ml-1 text-sm">NG</label>
                                </template>
                            </Column>
                        </DataTable>
                    </SplitterPanel>
                    <SplitterPanel :size="10">
                        <div
                            class="h-full flex items-center justify-center font-bold text-4xl text-white rounded-lg transition-all duration-300"
                            :class="{
                                'bg-green-500': inspResultMessage === '합격',
                                'bg-red-500': inspResultMessage === '불합격',
                                'bg-gray-400': inspResultMessage === '검사 대기 중' || inspResultMessage === '검사 중'
                            }"
                        >
                            {{ inspResultMessage }}
                        </div>
                    </SplitterPanel>
                </Splitter>
            </SplitterPanel>
        </Splitter>
    </div>
    <!-- </div> -->
</template>
