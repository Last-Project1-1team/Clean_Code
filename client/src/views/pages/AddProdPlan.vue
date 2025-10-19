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
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const startPlanDate = ref(null);
const endPlanDate = ref(null);
// 공정드롭다운
const procDropDown = ref([]);
const searchData = ref({});
const selectedData = ref({});
const selectedModel = ref({});

onMounted(() => {
    startPlanDate.value = new Date(); // 오늘 날짜를 기본값으로 설정
    endPlanDate.value = new Date();
});

onMounted(async () => {
    const response = await axios.get(`${apiUrl}/prodplan/proc`);
    procDropDown.value = response.data.map((proc) => ({
        label: proc.name, // 보여줄 이름
        value: proc.code // 실제 값
    }));
});

// 모달에서 가져온 제품정보
const handleModelRegister = (data) => {
    selectedModel.value = data; // 제품 전체 정보 저장
    ModalSearch.value = false;
};
</script>
<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <div class="grid grid-cols-12 gap-2">
                    <label for="startPlan" class="flex items-center col-span-1 mb-2 md:mb-0">계획시작일</label>
                    <div class="col-span-3">
                        <DatePicker id="startPlan" :showIcon="true" :showButtonBar="true" v-model="startPlanDate" date-format="yy-mm-dd" style="width: 250px"></DatePicker>
                    </div>

                    <label for="endPlan" class="flex items-center col-span-1 mb-2 md:mb-0">계획종료일</label>
                    <div class="col-span-2">
                        <DatePicker id="endPlan" :showIcon="true" :showButtonBar="true" v-model="endPlanDate" date-format="yy-mm-dd"></DatePicker>
                    </div>

                    <div class="col-span-2"></div>

                    <Button label="초기화" @click="initPlan"></Button>
                    <Button label="입력" @click="addPlan"></Button>
                    <Button label="저장" @click="searchPlan"></Button>

                    <label for="modelName" class="flex items-center col-span-1 mb-2 md:mb-0">제품코드</label>
                    <div class="col-span-3">
                        <InputText v-model="selectedModel.modelCode" id="modelName" type="text" style="width: 175px" />
                        <Button @click="ModalSearch = true" class="w-full" type="button" icon="pi pi-search" />
                    </div>
                    <label for="revision" class="flex items-center col-span-1 mb-2 md:mb-0">리비전</label>
                    <div class="col-span-2">
                        <InputText v-model="selectedModel.revision" id="revision" type="text" class="w-full" />
                    </div>

                    <div class="col-span-5"></div>

                    <label for="modelName" class="flex items-center col-span-1 mb-2 md:mb-0">제품명</label>
                    <div class="col-span-3">
                        <InputText v-model="selectedModel.modelName" id="modelName" type="text" style="width: 210px" />
                    </div>
                    <label for="selectProc" class="flex items-center col-span-1">공정선택</label>
                    <div class="col-span-2">
                        <Select v-model="searchData.procCode" :options="procDropDown" optionLabel="label" optionValue="value" placeholder="공정선택" id="selectProc" class="w-full" />
                    </div>

                    <div class="col-span-4"></div>
                    <Button label="삭제" @click="deletePlan"></Button>
                </div>
            </template>
        </Toolbar>

        <!-- 생산계획 등록 그리드 -->
        <DataTable v-model:selection="selectedPlans" :value="prodPlan" dataKey="prodPlanNo" :rows="10" :filters="filters" editMode="cell" @cell-edit-complete="onCellEditComplete" style="border: 1px solid #ddd; height: 60vh">
            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column field="regPlanDate" header="계획등록일자" sortable style="min-width: 12rem"></Column>
            <Column field="startPlanDate" header="계획시작일자" sortable style="min-width: 12rem"></Column>
            <Column field="endPlanDate" header="생산종료일자" sortable style="min-width: 12rem"></Column>
            <Column field="modelCode" header="제품코드" sortable style="min-width: 16rem"></Column>
            <Column field="revision" header="리비전" sortable style="min-width: 16rem"></Column>
            <Column field="modelName" header="제품명" sortable style="min-width: 16rem"></Column>
            <Column field="procName" header="공정" sortable style="min-width: 16rem"></Column>
            <Column field="Qty" header="수주량" sortable style="min-width: 12rem"></Column>
            <Column field="prodPlanDate" header="미 출고량" sortable style="min-width: 12rem"></Column>
            <Column field="planQty" header="계획수량" sortable style="min-width: 16rem">
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" showButtons mode="decimal" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="ModalSearch" header="제품 검색" modal style="width: 80vw; height: 80vh">
            <ModalSearchModel @register="handleModelRegister" />
        </Dialog>
    </div>
</template>
