<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ModalSearchModel from '@/components/ModalSearchModel.vue';
import { useToast } from 'primevue/usetoast';

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const toast = useToast();
// 제품 검색 모달
const ModalSearch = ref(false);

// 날짜 데이터 포멧
const formatDate = (date) => {
    if (!date) return ''; // null이나 undefined일 경우 공백 문자열 반환
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

onMounted(async () => {
    const response = await axios.get(`${apiUrl}/prodplan/proc`);
    if (response.data.length > 0) {
        const proc = response.data[0];
        searchData.value.procCode = proc.code;
        searchData.value.procName = proc.name;
    }
});

const startPlanDate = ref(new Date());
const endPlanDate = ref(null);
const regPlanDate = ref(null);
const selectedModel = ref({});
// 공정드롭다운
const procDropDown = ref([]);
const searchData = ref({});
const selectedData = ref({});
const prodPlan = ref([]);

// 모달에서 가져온 제품정보
const handleModelRegister = (data) => {
    selectedModel.value = data; // 제품 전체 정보 저장
    ModalSearch.value = false;
};

const getProdList = async (searchParams) => {
    try {
        prodPlan.value = [];

        // 1) 제품계획 데이터 조회
        const response = await axios.get(`${apiUrl}/prodplan`, {
            params: {
                regPlanDate: searchParams.regPlanDate,
                startPlanDate: searchParams.startPlanDate,
                endPlanDate: searchParams.endPlanDate,
                modelCode: searchParams.modelCode,
                revision: searchParams.revision,
                procCode: searchParams.procCode
            }
        });

        const prodList = Array.isArray(response.data) ? response.data : [];

        // 수주량 합계 조회
        const qtyResponse = await axios.get(`${apiUrl}/prodplan/inordqty`, {
            params: {
                regPlanDate: searchParams.regPlanDate,
                startPlanDate: searchParams.startPlanDate,
                endPlanDate: searchParams.endPlanDate,
                modelCode: searchParams.modelCode,
                revision: searchParams.revision,
                procCode: searchParams.procCode
            }
        });

        const qtyList = Array.isArray(qtyResponse.data) ? qtyResponse.data : [];

        // 수주량을 제품 리스트에 병합
        const mergedList = prodList.map((prod) => {
            const matchQty = qtyList.find((qty) => qty.modelCode === prod.modelCode && qty.revision === prod.revision && qty.procCode === prod.procCode);
            return {
                ...prod,
                totalInordQty: matchQty ? matchQty.totalInordQty : 0
            };
        });

        prodPlan.value = mergedList;
    } catch (err) {
        console.error('제품 조회 및 수주량 합계 조회 실패:', err);
        prodPlan.value = [];
    }
};

// 조회 버튼 이벤트
const searchPlan = () => {
    selectedData.value = {
        regPlanDate: regPlanDate.value ? formatDate(regPlanDate.value) : '',
        startPlanDate: startPlanDate.value ? formatDate(startPlanDate.value) : '',
        endPlanDate: endPlanDate.value ? formatDate(endPlanDate.value) : '',
        modelCode: selectedModel.value.modelCode || '',
        revision: selectedModel.value.revision || '',
        procCode: searchData.value.procCode || ''
    };
    // getProdList 함수를 호출할 때 selectedData.value를 인자로 넘겨줌
    getProdList(selectedData.value);
};

// 초기화 버튼 이벤트
const initPlan = () => {
    regPlanDate.value = null;
    startPlanDate.value = null;
    endPlanDate.value = null;
    selectedModel.value = {};
    selectedData.value = {};
    if (searchData.value) {
        // 필요한 검색 조건만 초기화
        searchData.value.modelCode = '';
        searchData.value.revision = '';
        searchData.value.modelName = '';
    }
};
</script>

<template>
    <div class="card">
        <Toolbar class="mb-6 relative">
            <template #start>
                <div class="grid grid-cols-12 gap-2 w-full">
                    <!-- 계획시작일 -->
                    <label for="startPlan" class="flex items-center col-span-1">계획시작일</label>
                    <div class="col-span-3">
                        <DatePicker v-model="startPlanDate" id="startPlan" :showIcon="true" :showButtonBar="true" date-format="yy-mm-dd" style="width: 250px" />
                    </div>

                    <!-- 계획종료일 -->
                    <label for="endPlan" class="flex items-center col-span-1">계획종료일</label>
                    <div class="col-span-2">
                        <DatePicker v-model="endPlanDate" id="endPlan" :showIcon="true" :showButtonBar="true" date-format="yy-mm-dd" />
                    </div>

                    <div class="col-span-5"></div>

                    <!-- 제품코드 -->
                    <label for="modelCode" class="flex items-center col-span-1">제품코드</label>
                    <div class="col-span-3 flex items-center gap-1">
                        <InputText v-model="selectedModel.modelCode" id="modelCode" type="text" style="width: 175px" readonly />
                        <Button @click="ModalSearch = true" icon="pi pi-search" class="lensButton p-button-success" />
                    </div>

                    <!-- 리비전 -->
                    <label for="revision" class="flex items-center col-span-1">리비전</label>
                    <div class="col-span-2">
                        <InputText v-model="selectedModel.revision" id="revision" type="text" class="w-full" readonly />
                    </div>

                    <div class="col-span-5"></div>

                    <!-- 제품명 -->
                    <label for="modelName" class="flex items-center col-span-1">제품명</label>
                    <div class="col-span-3">
                        <InputText v-model="selectedModel.modelName" id="modelName" type="text" style="width: 210px" readonly />
                    </div>

                    <!-- 공정선택 -->
                    <label for="selectProc" class="flex items-center col-span-1">최종공정</label>
                    <div class="col-span-2">
                        <!-- <Select v-model="searchData.procCode" :options="procDropDown" optionLabel="label" optionValue="value" placeholder="공정선택" id="selectProc" class="w-full" /> -->
                        <InputText v-model="searchData.procName" id="selectProc" class="w-full" readonly />
                    </div>

                    <!-- ✅ 버튼 그룹 (등록 화면과 동일 구조) -->
                    <div class="absolute top-3 right-4 flex gap-2">
                        <Button label="초기화" class="p-button-outlined px-5 py-2 font-bold" @click="initPlan" />
                        <Button label="조회" class="p-button-success px-5 py-2 font-bold" @click="searchPlan" />
                    </div>
                </div>
            </template>
        </Toolbar>

        <!-- 생산계획 등록 그리드 -->
        <DataTable :value="prodPlan" dataKey="prodPlanNo" scrollable scrollHeight="63.8vh" style="border: 1px solid #ddd; height: 63.8vh">
            <Column field="startPlanDate" header="계획시작일자" sortable style="min-width: 10rem"></Column>
            <Column field="endPlanDate" header="계획종료일자" sortable style="min-width: 10rem"></Column>
            <Column field="modelCode" header="제품코드" sortable style="min-width: 10rem"></Column>
            <Column field="revision" header="리비전" sortable style="min-width: 8rem"></Column>
            <Column field="modelName" header="제품명" sortable style="min-width: 10rem"></Column>
            <Column field="procName" header="최종공정" sortable style="min-width: 8rem"></Column>
            <Column field="totalInordQty" header="수주량" sortable style="min-width: 9rem"></Column>
            <Column field="planQty" header="계획수량" sortable style="min-width: 9rem"></Column>
            <Column field="unit" header="단위" sortable style="min-width: 5rem"></Column>
        </DataTable>

        <Dialog v-model:visible="ModalSearch" header="제품 검색" modal style="width: 80vw; height: 80vh">
            <ModalSearchModel @register="handleModelRegister" />
        </Dialog>
    </div>
</template>

<style scoped>
button {
    margin-right: 2px;
    width: 100px;
    height: 50px;
}
.lensButton {
    width: 32px;
    height: 32px;
}
</style>
