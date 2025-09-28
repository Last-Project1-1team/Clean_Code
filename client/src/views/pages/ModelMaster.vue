<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">제품검색 부분</div>
        <div class="grid grid-cols-12 gap-2">
            <!-- 제품코드 -->
            <label class="flex items-center col-span-12 mb-2 md:col-span-1 md:mb-0">제품코드</label>
            <div class="col-span-12 md:col-span-3">
                <InputText v-model="modelCode" class="w-full" />
            </div>

            <div class="col-span-1"></div>

            <!-- 리비전 -->
            <label class="flex items-center col-span-12 mb-2 md:col-span-1 md:mb-0">리비전</label>
            <div class="col-span-12 md:col-span-3">
                <InputText v-model="revision" class="w-full" />
            </div>

            <div class="col-span-2"></div>

            <!-- 조회버튼 -->
            <Button label="조회" icon="pi pi-search" @click="modelSearch" />

            <!-- 제품명 -->
            <label class="flex items-center col-span-12 mb-2 md:col-span-1 md:mb-0">제품명</label>
            <div class="col-span-12 md:col-span-8">
                <InputText v-model="modelName" class="w-full" />
            </div>
        </div>
    </div>

    <!-- 제품 그리드 -->

    <div class="card">
        <div class="font-semibold text-xl mb-4">Frozen Columns</div>

        <DataTable :value="result" scrollable scrollHeight="400px" class="mt-6">
            <Column field="model_code" header="제품코드" style="min-width: 200px" frozen class="font-bold"></Column>
            <Column field="model_name" header="제품명" style="min-width: 400px"></Column>
            <Column field="revision" header="리비전" style="min-width: 150px"></Column>
            <Column field="model_flag" header="제품구분" style="min-width: 150px"></Column>
            <Column field="lot_qty" header="LOT당 수량" style="min-width: 200px"></Column>
            <Column field="spec" header="규격" style="min-width: 300px"></Column>
            <Column field="width" header="폭" style="min-width: 150px"></Column>
            <Column field="length" header="길이" style="min-width: 150px"></Column>
        </DataTable>
    </div>

    <!-- 제품 등록, 수정-->

    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">구분2</div>
        <div class="grid grid-cols-12 gap-2">
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

<script setup>
import { ref } from 'vue';
//import axios from 'axios';

const modelcode = ref('');
const revision = ref('');
const modelname = ref('');

const result = ref([]);

/*
const modelSearch = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/model', {
            params: {
                model_code: modelcode.value,
                revision: revision.value,
                model_name: modelname.value
            }
        });
        result.value = response.data;
    } catch (error) {
        console.error('조회 실패:', error);
    }
};
*/
</script>
