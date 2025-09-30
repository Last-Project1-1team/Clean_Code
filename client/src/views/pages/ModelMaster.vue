<script setup>
import { ref } from 'vue';
import ModelSearch from '@/components/ModelSearch.vue';
//import axios from 'axios';

const searchResult = ref([]);

const dropdownValues = ref([
    { label: '완제품', value: '완제품' },
    { label: '반제품', value: '반제품' }
]);

const selectedModel = ref({});

const formData = ref({
    modelCode: '',
    revision: '',
    modelName: '',
    modelFlag: '',
    lotPQty: null,
    spec: '',
    width: '',
    height: ''
});

// 초기화 버튼
function onClearItem() {
    console.log('초기화버튼클릭됨');
    formData.value = {
        modelCode: '',
        revision: '',
        modelName: '',
        modelFlag: '',
        lotPQty: null,
        spec: '',
        width: '',
        height: ''
    };
}

function modelSearch(payload) {
    console.log('검색 조건:', payload);
}

/*
const modelSearch = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/modelmaster', {
            params: {
                model_code: modelCode.value,
                revision: revision.value,
                model_name: modelName.value
            }
        });
        result.value = response.data;
    } catch (error) {
        console.error('조회 실패:', error);
    }
};
*/
</script>

<template>
    <div class="card" style="padding: 30px">
        <ModelSearch @search="modelSearch" />

        <!-- 제품 그리드 -->

        <DataTable
            :value="searchResult"
            v-model:selection="selectedModel"
            selectionMode="single"
            datakey="modelCode"
            scrollable
            scrollHeight="400px"
            class="mt-6"
            style="height: 40vh; border: 1px solid #ddd"
            @rowSelect="formData = { ...$event.data }"
        >
            <Column field="modelCode" header="제품코드" style="min-width: 200px"></Column>
            <Column field="modelName" header="제품명" style="min-width: 300px"></Column>
            <Column field="revision" header="리비전" style="min-width: 150px"></Column>
            <Column field="modelFlag" header="제품구분" style="min-width: 150px"></Column>
            <Column field="lotPQty" header="LOT당 수량" style="min-width: 150px"></Column>
            <Column field="spec" header="규격" style="min-width: 200px"></Column>
            <Column field="width" header="폭" style="min-width: 100px"></Column>
            <Column field="height" header="길이" style="min-width: 100px"></Column>
        </DataTable>

        <!-- 제품Master 하단 제품 등록 / 수정-->
        <div class="grid grid-cols-12 gap-2" style="padding-top: 50px">
            <label for="modelCode" class="flex items-center col-span-1 mb-2 md:mb-0">제품코드</label>
            <div class="col-span-3">
                <InputText id="modelCode" type="text" class="w-full" v-model="formData.modelCode" />
            </div>

            <div class="col-span-1"></div>

            <label for="revision" class="flex items-center col-span-1 mb-2 md:mb-0">리비전</label>
            <div class="col-span-3">
                <InputText id="revision" type="text" class="w-full" v-model="formData.revision" />
            </div>

            <div class="col-span-1"></div>

            <Button label="초기화" class="p-button-outlined px-6 py-3 text-lg font-bold" @click="onClearItem" />
            <Button label="저장" class="p-button-success px-6 py-3 text-lg font-bold" />

            <label for="modelName" class="flex items-center col-span-1 mb-2 md:mb-0">제품명</label>
            <div class="col-span-8">
                <InputText id="modelName" type="text" class="w-full" v-model="formData.modelName" />
            </div>

            <div class="col-span-3"></div>

            <!-- 여기에 제품구분(완/반제) , LOT당 수량 -->
            <label for="modelFlag" class="flex items-center col-span-1 mb-2 md:mb-0">제품구분</label>
            <div class="col-span-3">
                <Select class="w-full" v-model="formData.modelFlag" :options="dropdownValues" optionLabel="label" optionValue="value" />
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
        </div>
    </div>
</template>
<style scoped></style>
