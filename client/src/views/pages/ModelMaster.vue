<script setup>
import { ref, onMounted } from 'vue';
import ModelMasterSearch from '@/components/ModelMasterSearch.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const router = useRouter(); // root 컴포넌트에 등록된 라우터를 불러오는 함수
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// 컴포넌트가 마운트될 때 options 데이터 로드
onMounted(async () => {
    const response = await axios.get(`${apiUrl}/modelmaster/modelFlag`);
    flagDropdown.value = response.data.map((model) => ({
        label: model.name, // 보여줄 이름
        value: model.code // 실제 값
    }));
    const responseUnit = await axios.get(`${apiUrl}/modelmaster/modelUnit`);
    flagDropdownUnit.value = responseUnit.data.map((model) => ({
        label: model.code, // 보여줄 이름
        value: model.name // 실제 값
    }));
});

const modelMaster = ref([]);
const selectedModel = ref({});
const flagDropdown = ref([]);
const flagDropdownUnit = ref([]);
const toast = useToast();
const formData = ref({
    modelCode: '',
    revision: '',
    modelName: '',
    modelFlag: '',
    lotPQty: '',
    spec: '',
    width: '',
    height: '',
    unit: ''
});

// 초기화 버튼
function onClearItem() {
    // console.log('초기화버튼클릭됨');
    formData.value = {
        modelCode: '',
        revision: '',
        modelName: '',
        modelFlag: '',
        lotPQty: null,
        spec: '',
        width: '',
        height: '',
        unit: ''
    };
}

const modelSearch = (model) => {
    //console.log('📩 부모: 자식이 보낸 검색값', model);
    getModelList(model.code, model.revision, model.name);
};

const getModelList = async (code, revision, name) => {
    //console.log('🌐 서버 요청 보냄', code, revision, name);
    let result = await axios
        .get(`${apiUrl}/modelmaster?`, {
            params: {
                modelCode: code || '',
                revision: revision || '',
                modelName: name || ''
            }
        })
        .catch((err) => {
            console.error('제품 조회 실패:', err);
            modelMaster.value = result.data;
        });
    // console.log('✅ 서버 응답', result);
    // console.log('📦 응답 데이터 타입:', typeof result?.data, result?.data);
    console.log(result.data);
    modelMaster.value = result.data;
};

const saveButton = async () => {
    const payload = {
        model_code: formData.value.modelCode,
        revision: formData.value.revision,
        model_name: formData.value.modelName,
        model_flag: formData.value.modelFlag,
        lot_p_qty: formData.value.lotPQty,
        spec: formData.value.spec,
        wid: formData.value.width,
        hei: formData.value.height,
        unit: formData.value.unit
    };

    console.log('저장 payload:', payload);

    let result = await axios.post(`${apiUrl}/modelMaster`, payload).catch((err) => console.log(err));
    let addRes = result.data;
    if (addRes.isSuccessed) {
        toast.add({ severity: 'success', summary: '저장 성공', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: '저장 실패', life: 3000 });
    }
    getModelList();
};
</script>

<template>
    <div class="card">
        <ModelMasterSearch @search="modelSearch" />

        <!-- 제품 그리드 -->

        <DataTable
            class="custom-table"
            :value="modelMaster"
            v-model:selection="selectedModel"
            selectionMode="single"
            datakey="modelCode"
            scrollable
            scrollHeight="40.8px"
            style="height: 41.1vh; border: 1px solid #ddd"
            @rowSelect="formData = { ...$event.data }"
        >
            <Column field="modelCode" header="제품코드" style="min-width: 200px"></Column>
            <Column field="modelName" header="제품명" style="min-width: 250px"></Column>
            <Column field="revision" header="리비전" style="min-width: 150px"></Column>
            <Column field="modelFlagName" header="제품구분" style="min-width: 150px"></Column>
            <Column field="lotPQty" header="LOT당 수량" style="min-width: 150px"></Column>
            <Column field="spec" header="규격" style="min-width: 200px"></Column>
            <Column field="width" header="폭" style="min-width: 100px"></Column>
            <Column field="height" header="길이" style="min-width: 100px"></Column>
            <Column field="unit" header="단위" style="min-width: 100px"></Column>
        </DataTable>

        <!-- 제품Master 하단 제품 등록 / 수정-->
        <div class="relative">
            <div class="card flex flex-col gap-1">
                <div class="grid grid-cols-12 gap-2">
                    <label for="modelCode" class="flex items-center col-span-1 mb-2 md:mb-0">제품코드</label>
                    <div class="col-span-3">
                        <InputText id="modelCode" type="text" class="w-full" v-model="formData.modelCode" />
                    </div>

                    <div class="col-span-1"></div>

                    <label for="revision" class="flex items-center col-span-1 mb-2 md:mb-0">리비전</label>
                    <div class="col-span-3">
                        <InputText id="revision" type="text" class="w-full" v-model="formData.revision" />
                    </div>

                    <div class="col-span-3"></div>

                    <label for="modelName" class="flex items-center col-span-1 mb-2 md:mb-0">제품명</label>
                    <div class="col-span-3">
                        <InputText id="modelName" type="text" class="w-full" v-model="formData.modelName" />
                    </div>

                    <div class="col-span-1"></div>

                    <label for="unit" class="flex items-center col-span-1 mb-2 md:mb-0">단위</label>
                    <div class="col-span-3">
                        <Select class="w-full" v-model="formData.unit" :options="flagDropdownUnit" optionLabel="label" optionValue="value" />
                    </div>

                    <div class="col-span-3"></div>

                    <!-- 여기에 제품구분(완/반제) , LOT당 수량 -->
                    <label for="modelFlag" class="flex items-center col-span-1 mb-2 md:mb-0">제품구분</label>
                    <div class="col-span-3">
                        <Select class="w-full" v-model="formData.modelFlag" :options="flagDropdown" optionLabel="label" optionValue="value" />
                    </div>

                    <div class="col-span-1"></div>

                    <label for="lotPQty" class="flex items-center col-span-1 mb-2 md:mb-0">LOT당 수량</label>
                    <div class="col-span-3">
                        <InputNumber class="w-full" v-model="formData.lotPQty" showButtons mode="decimal"></InputNumber>
                    </div>

                    <div class="col-span-3"></div>

                    <label for="spec" class="flex items-center col-span-1 mb-2 md:mb-0">규격</label>
                    <div class="col-span-8">
                        <InputText id="spec" type="text" class="w-full" v-model="formData.spec" />
                    </div>

                    <div class="col-span-3"></div>

                    <label for="width" class="flex items-center col-span-1 mb-2 md:mb-0">폭</label>
                    <div class="col-span-3">
                        <InputText id="width" type="text" class="w-full" v-model="formData.width" />
                    </div>

                    <div class="col-span-1"></div>

                    <label for="height" class="flex items-center col-span-1 mb-2 md:mb-0">길이</label>
                    <div class="col-span-3">
                        <InputText id="height" type="text" class="w-full" v-model="formData.height" />
                    </div>

                    <div id="button_" class="absolute top-0 right-0 flex gap-2">
                        <Button label="초기화" class="p-button-outlined px-6 py-3 text-lg font-bold" @click="onClearItem" />
                        <Button label="저장" class="p-button-success px-6 py-3 text-lg font-bold" @click="saveButton" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.custom-table .p-datatable-tbody > tr > td) {
    font-size: 1rem !important;
    padding: 4px 8px;
}
#button_ {
    margin: 20px;
}
</style>
