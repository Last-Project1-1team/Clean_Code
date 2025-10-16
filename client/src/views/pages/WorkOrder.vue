<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
    const response = await axios.get(`${apiUrl}/workorder/proc`);
    procDropDown.value = response.data.map((proc) => ({
        label: proc.name, // 보여줄 이름
        value: proc.code // 실제 값
    }));
});
// 공정드롭다운
const procDropDown = ref([]);
// 공정, 생산계획일자
const searchData = ref({
    proc: '',
    prodPlanDate: ''
});
// 조회 결과 담을 배열
const prodPlanList = ref([]);

// 전체조회
const searchProdPlan = async (proc, prodPlanDate) => {
    // console.log('🌐 서버 요청 보냄', proc, prodPlanDate);

    const dateValue = searchData.value.prodPlanDate ? new Date(searchData.value.prodPlanDate.getTime() - searchData.value.prodPlanDate.getTimezoneOffset() * 60000).toISOString().split('T')[0] : '';
    console.log(dateValue);
    let result = await axios
        .get(`${apiUrl}/workorder/search`, {
            params: {
                proc: searchData.value.proc || '',
                prodPlanDate: dateValue || ''
            }
        })
        .catch((err) => {
            console.error('제품 조회 실패:', err);
            prodPlanList.value = result.data;
        });
    // console.log('✅ 서버 응답', result);
    // console.log('📦 응답 데이터 타입:', typeof result?.data, result?.data);
    prodPlanList.value = result.data;
};

function removeSearch() {
    searchData.value = {
        proc: '',
        prodPlanDate: ''
    };
}

const dt = ref([]);
const filters = ref([]);
const onCellEditComplete = ref([]);
const selectedPlans = ref([]);

const saveWorkOrder = () => {
    if (!selectedPlans.value || selectedPlans.value.length === 0) {
        alert('저장할 행을 선택해주세요.');
        return;
    }

    // 선택된 행들만 서버로 전송
    axios
        .post(`${apiUrl}/workorder/save`, selectedPlans.value)
        .then((res) => {
            // console.log('저장 성공:', res.data);
            alert('저장이 완료되었습니다.');
        })
        .catch((err) => {
            // console.error('저장 실패:', err);
            alert('저장 중 오류가 발생했습니다.');
        });
};
</script>

<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <!-- 화면 상단 생산계획 검색 부분-->
                <div class="grid grid-cols-12 gap-2">
                    <label for="proc" class="grid grid-cols-1 flex items-center">공정</label>
                    <div class="col-span-3">
                        <Select class="w-full" v-model="searchData.proc" :options="procDropDown" optionLabel="label" optionValue="value" placeholder="공정선택" />
                    </div>

                    <div class="col-span-1"></div>

                    <label for="prodPlanDate" class="grid grid-cols-1 flex items-center">생산계획일자</label>
                    <div class="col-span-3">
                        <DatePicker :showIcon="true" :showButtonBar="true" v-model="searchData.prodPlanDate" dateFormat="yy-mm-dd" class="w-full"></DatePicker>
                    </div>
                </div>
            </template>
            <template #end>
                <!--<Button label="출력" class="p-button-outlined px-6 py-3 text-lg font-bold" />-->
                <Button label="초기화" class="p-button-outlined px-6 py-3 text-lg font-bold" @click="removeSearch" />
                <Button label="저장" class="p-button-outlined px-6 py-3 text-lg font-bold" @click="saveWorkOrder" />
                <Button label="조회" class="p-button-outlined px-6 py-3 text-lg font-bold" @click="searchProdPlan" />
            </template>
        </Toolbar>

        <!-- 작업지시 그리드 -->
        <DataTable ref="dt" v-model:selection="selectedPlans" :value="prodPlanList" :rows="10" :filters="filters" selectionMode="multiple" editMode="cell" @cell-edit-complete="onCellEditComplete" style="border: 1px solid #ddd; height: 70vh">
            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column field="prodPlanDate" header="생산계획일자" sortable style="min-width: 12rem"></Column>
            <Column field="modelCode" header="제품코드" sortable style="min-width: 16rem"></Column>
            <Column field="revision" header="리비전" sortable style="min-width: 16rem"></Column>
            <Column field="modelName" header="제품명" sortable style="min-width: 16rem"></Column>
            <Column field="procCodeName" header="공정" sortable style="min-width: 16rem"></Column>
            <Column field="workOrdQty" header="작업지시수량" sortable style="min-width: 16rem">
                <template #body="{ data }">
                    <input v-model.number="data.workOrdQty" type="number" min="0" step="1" class="w-40 border p-1" />
                </template>
            </Column>
            <Column field="unit" header="단위" sortable style="min-width: 16rem"></Column>
        </DataTable>
    </div>
</template>
