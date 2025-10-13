<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <!-- 화면 상단 생산계획 검색 부분-->
                <div class="grid grid-cols-12 gap-2">
                    <label for="prodPlanNo" class="flex items-center col-3 mb-2 md:mb-0">생산계획코드</label>
                    <div class="col-1"></div>
                    <AutoComplete id="prodPlanNo" class="col-span-6" v-model="selectedAutoValue" :suggestions="autoFilteredValue" optionLabel="prodPlanNo" placeholder="생산계획번호" dropdown display="chip" @complete="searchCountry($event)" />
                </div>
            </template>
            <template #end>
                <Button label="출력" class="p-button-outlined px-6 py-3 text-lg font-bold" />
                <Button label="저장" class="p-button-outlined px-6 py-3 text-lg font-bold" @click="saveWorkOrder" />
                <Button label="조회" class="p-button-outlined px-6 py-3 text-lg font-bold" @click="searchProdPlan" />
            </template>
        </Toolbar>

        <!-- 작업지시 그리드 -->
        <DataTable ref="dt" v-model:selection="selectedPlans" :value="prodPlan" dataKey="prodPlanNo" :rows="10" :filters="filters" editMode="cell" @cell-edit-complete="onCellEditComplete" style="border: 1px solid #ddd; height: 70vh">
            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column field="prodPlanDate" header="생산계획일자" sortable style="min-width: 12rem"></Column>
            <Column field="modelCode" header="제품코드" sortable style="min-width: 16rem"></Column>
            <Column field="revision" header="리비전" sortable style="min-width: 16rem"></Column>
            <Column field="modelName" header="제품명" sortable style="min-width: 16rem"></Column>
            <Column field="proc" header="공정" sortable style="min-width: 16rem"></Column>
            <Column field="workOrderQty" header="작업지시수량" sortable style="min-width: 16rem">
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" showButtons mode="decimal" />
                </template>
            </Column>
            <Column field="unit" header="단위" sortable style="min-width: 16rem"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const dt = ref([]);
const filters = ref([]);
const onCellEditComplete = ref([]);

const prodPlan = ref([]);
const selectedPlans = ref([]);
const selectedAutoValue = ref(null); // 선택된 AutoComplete 값
const autoFilteredValue = ref([]); // 자동완성 추천 목록

const searchCountry = async (event) => {
    //console.log('🌐 서버 요청 보냄', event);
    let result = await axios
        .get(`${apiUrl}/workorder/autocomplete`, {
            params: {
                keyword: event.query
            }
        })
        .catch((err) => {
            console.error('제품 조회 실패:', err);
            autoFilteredValue.value = [];
        });
    // console.log('✅ 서버 응답', result);
    // console.log('📦 응답 데이터 타입:', typeof result?.data, result?.data);
    autoFilteredValue.value = result.data;
};

const searchProdPlan = () => {
    if (selectedAutoValue.value && selectedAutoValue.value.prodPlanNo) {
        getProdPlan(selectedAutoValue.value.prodPlanNo);
    } else {
        getProdPlan(); // 전체 조회용 fallback (선택 안 했을 때)
    }
};

const getProdPlan = async (prodPlanNo) => {
    // console.log('🌐 서버 요청 보냄', prodPlanNo);
    let result = await axios
        .get(`${apiUrl}/workorder?`, {
            params: {
                prodPlanNo: prodPlanNo || ''
            }
        })
        .catch((err) => {
            console.error('제품 조회 실패:', err);
            prodPlan.value = [];
        });
    // console.log('✅ 서버 응답', result);
    // console.log('📦 응답 데이터 타입:', typeof result?.data, result?.data);
    prodPlan.value = result.data;
};

const saveWorkOrder = () => {
    if (!selectedPlans.value || selectedPlans.value.length === 0) {
        alert('저장할 행을 선택해주세요.');
        return;
    }

    // 선택된 행들만 서버로 전송
    axios
        .post(`${apiUrl}/workorder/save`, selectedPlans.value)
        .then((res) => {
            // console.log('✅ 저장 성공:', res.data);
            alert('저장이 완료되었습니다.');
        })
        .catch((err) => {
            // console.error('💥 저장 실패:', err);
            alert('저장 중 오류가 발생했습니다.');
        });
};
</script>
