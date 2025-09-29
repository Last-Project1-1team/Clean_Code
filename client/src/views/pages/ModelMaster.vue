<script setup>
import { ref } from 'vue';
import ModelSearch from '@/components/ModelSearch.vue';
//import axios from 'axios';

const result = ref([]);

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
    <div class="card" style="padding-top: 0px">
        <ModelSearch @search="modelSearch" />

        <!-- 제품 그리드 -->

        <DataTable :value="result" scrollable scrollHeight="400px" class="mt-6" style="height: 40vh">
            <Column field="model_code" header="제품코드" style="min-width: 200px" frozen class="font-bold"></Column>
            <Column field="model_name" header="제품명" style="min-width: 400px"></Column>
            <Column field="revision" header="리비전" style="min-width: 150px"></Column>
            <Column field="model_flag" header="제품구분" style="min-width: 150px"></Column>
            <Column field="lot_qty" header="LOT당 수량" style="min-width: 200px"></Column>
            <Column field="spec" header="규격" style="min-width: 300px"></Column>
            <Column field="width" header="폭" style="min-width: 150px"></Column>
            <Column field="length" header="길이" style="min-width: 150px"></Column>
        </DataTable>

        <!-- 제품 등록, 수정-->

        <!-- 제품Master 하단 제품 등록 / 수정-->
        <div class="grid grid-cols-12 gap-2" style="padding-top: 50px">
            <label for="name3" class="flex items-center col-span-12 mb-2 md:col-span-1 md:mb-0">제품코드</label>
            <div class="col-span-12 md:col-span-3">
                <InputText id="name3" type="text" class="w-full" />
            </div>

            <div class="col-span-1"></div>

            <label for="email3" class="flex items-center col-span-12 mb-2 md:col-span-1 md:mb-0">리비전</label>
            <div class="col-span-12 md:col-span-3">
                <InputText id="email3" type="text" class="w-full" />
            </div>

            <div class="col-span-1"></div>

            <Button label="초기화" />
            <Button label="저장" />

            <label for="email3" class="flex items-center col-span-12 mb-2 md:col-span-1 md:mb-0">제품명</label>
            <div class="col-span-12 md:col-span-8">
                <InputText id="email3" type="text" class="w-full" />
            </div>

            <div class="col-span-3"></div>

            <!-- 여기에 제품구분(완/반제) , LOT당 수량 -->
            <label for="email3" class="flex items-center col-span-12 mb-2 md:col-span-1 md:mb-0">제품구분</label>
            <div class="col-span-12 md:col-span-4">
                <Select style="width: 366px" v-model="dropdownValue" :options="dropdownValues" optionLabel="model_flag" placeholder="Select" />
            </div>

            <label for="email3" class="flex items-center col-span-12 mb-2 md:col-span-1 md:mb-0">LOT당 수량</label>
            <div class="col-span-12 md:col-span-4">
                <InputNumber style="width: 366px" v-model="inputNumberValue" showButtons mode="decimal"></InputNumber>
            </div>

            <div class="col-span-2"></div>

            <label for="email3" class="flex items-center col-span-12 mb-2 md:col-span-1 md:mb-0">규격</label>
            <div class="col-span-12 md:col-span-8">
                <InputText id="email3" type="text" class="w-full" />
            </div>

            <div class="col-span-3"></div>

            <label for="name3" class="flex items-center col-span-12 mb-2 md:col-span-1 md:mb-0">폭</label>
            <div class="col-span-12 md:col-span-3">
                <InputText id="name3" type="text" class="w-full" />
            </div>

            <div class="col-span-1"></div>

            <label for="email3" class="flex items-center col-span-12 mb-2 md:col-span-1 md:mb-0">길이</label>
            <div class="col-span-12 md:col-span-3">
                <InputText id="email3" type="text" class="w-full" />
            </div>
        </div>
    </div>
</template>
