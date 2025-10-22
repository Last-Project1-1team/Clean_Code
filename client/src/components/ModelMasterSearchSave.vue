<script setup>
import { ref } from 'vue';

const emit = defineEmits(['submit', 'toss']); // 부모에 알릴 이벤트 정의
const modelCode = ref('');
const modelName = ref('');

// 버튼 클릭 시 부모로 데이터 전달
const selectModel = () => {
    console.log('selectModel:', modelCode.value, modelName.value);
    emit('submit', { code: modelCode.value, name: modelName.value });
    console.log('submit:', modelCode.value, modelName.value);
};
const tossModel = () => {
    emit('toss');
};
</script>
<template>
    <Toolbar class="mb-6">
        <template #start>
            <div class="grid grid-cols-12 gap-2">
                <label for="modelCode" class="flex models-center">제품코드</label>
                <div class="col-span-4">
                    <InputText id="modelCode" type="text" class="w-full" v-model="modelCode" />
                </div>

                <label for="modelName" class="flex models-center">제품명</label>
                <div class="col-span-4">
                    <InputText id="modelName" type="text" class="w-full" v-model="modelName" />
                </div>
            </div>
        </template>
        <template #end>
            <Button label="저장" @click="tossModel"></Button>
            <Button label="조회" @click="selectModel"></Button>
        </template>
    </Toolbar>
</template>

<style scoped>
.card.flex.flex-col.gap-1 {
    padding: 5px;
}
.flex.models-center {
    margin-left: 20px;
    margin-right: 20px;
}
button {
    margin-right: 10px;
    width: 100px;
    height: 50px;
}
</style>
