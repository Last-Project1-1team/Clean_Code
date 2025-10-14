<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import ModelMasterSearchSaveVue from './ModelMasterSearchSave.vue';

const emit = defineEmits(['register']);

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const models = ref([]);
const selectedModels = ref([]);
const keyword = ref('');
onMounted(async () => {
    getModelList('', '');
});

const registerModels = () => {
    // 부모로 선택된 데이터 전달
    emit('register', selectedModels.value);
};

const handleSubmit = (model) => {
    getModelList(model.code, model.name);
};
const handleToss = () => {
    registerModels();
};

const getModelList = async (code, rivision, name) => {
    let result = await axios
        .get(`${apiUrl}/modelMaster?`, {
            params: {
                modelCode: code || '',
                revision: rivision || '',
                modelName: name || ''
            }
        })
        .catch((err) => {
            console.error('아이템 조회 실패:', err);
            models.value = [];
        });
    models.value = result.data;
};
</script>

<template>
    <div>
        <ModelMasterSearchSaveVue @submit="handleSubmit" @toss="handleToss" />
        <!-- <Toolbar class="mb-6">
            <template #start>
                <div class="grid grid-cols-12 gap-2">
                    <label for="itemCode" class="flex items-center">자재코드</label>
                    <div class="col-span-4">
                        <InputText id="itemCode" type="text" class="w-full" v-model="itemCode" />
                    </div>

                    <label for="itemName" class="flex items-center">자재명</label>
                    <div class="col-span-4">
                        <InputText id="itemName" type="text" class="w-full" v-model="itemName" />
                    </div>
                </div>
            </template>
            <template #end>
                <Button label="등록" class="p-button-success" @click="registerItems" />
                <Button label="조회" @click="searchItems" />
            </template>
        </Toolbar> -->

        <DataTable :value="models" v-model:selection="selectedModels" dataKey="modelCode" selectionMode="multiple" scrollable scrollHeight="40vh">
            <Column selectionMode="multiple" headerStyle="width: 3em" />
            <Column field="modelCode" style="width: 100px" header="제품코드" />
            <Column field="modelName" style="width: 150px" header="제품명" />
            <Column field="revision" style="width: 150px" header="리비전" />
            <Column field="modelFlag" style="width: 150px" header="제품구분" />
            <Column field="inordQty" style="width: 150px" header="수주량" />
            <Column field="yesOutPutQty" style="width: 150px" header="기출고량" />
            <Column field="noOutPutQty" style="width: 150px" header="미출고량" />
            <Column field="unit" style="width: 50px" header="단위" />
        </DataTable>
    </div>
</template>
