<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

const emit = defineEmits(['register']);

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const modelList = ref([]);
const selectedModels = ref([]);
const modelCode = ref('');
const revision = ref('');
const modelName = ref('');

onMounted(async () => {
    getModelList();
});

const registerModels = () => {
    // 부모로 선택된 데이터 전달
    emit('register', selectedModels.value);
};

// 저장버튼
const tossModel = () => {
    registerModels();
};

// 조회버튼
const selectModel = () => {
    getModelList(modelCode.value, revision.value, modelName.value);
};

const getModelList = async (code, revision, name) => {
    let result = await axios
        .get(`${apiUrl}/modelMaster?`, {
            params: {
                modelCode: code || '',
                revision: revision || '',
                modelName: name || ''
            }
        })
        .catch((err) => {
            console.error('아이템 조회 실패:', err);
            modelList.value = [];
        });
    modelList.value = result.data;
};
</script>

<template>
    <div>
        <Toolbar class="mb-6">
            <template #start>
                <div class="grid grid-cols-12 gap-2">
                    <label for="modelCode" class="flex items-center">제품코드</label>
                    <div class="col-span-3">
                        <InputText id="modelCode" type="text" class="w-full" v-model="modelCode" />
                    </div>

                    <label for="revision" class="flex items-center">리비전</label>
                    <div class="col-span-3">
                        <InputText id="revision" type="text" class="w-full" v-model="revision" />
                    </div>

                    <label for="modelName" class="flex items-center">제품명</label>
                    <div class="col-span-3">
                        <InputText id="modelName" type="text" class="w-full" v-model="modelName" />
                    </div>
                </div>
            </template>
            <template #end>
                <Button label="저장" @click="tossModel"></Button>
                <Button label="조회" @click="selectModel"></Button>
            </template>
        </Toolbar>

        <DataTable :value="modelList" v-model:selection="selectedModels" :dataKey="(row) => row.modelCode + '_' + row.revision" selectionMode="single" scrollable scrollHeight="58vh">
            <Column field="modelCode" style="width: 100px" header="제품코드" />
            <Column field="modelName" style="width: 150px" header="제품명" />
            <Column field="revision" style="width: 150px" header="리비전" />
            <Column field="modelFlag" style="width: 150px" header="제품구분" />
            <Column field="unit" style="width: 50px" header="단위" />
        </DataTable>
    </div>
</template>
<style scoped>
button {
    margin-right: 10px;
    width: 100px;
    height: 50px;
}
</style>
