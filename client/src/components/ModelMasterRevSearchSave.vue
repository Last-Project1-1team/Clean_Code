<script setup>
import { ref } from 'vue';

// 부모에게 알림만 보냄
const emit = defineEmits(['search']);
const modelCode = ref('');
const revision = ref('');
const modelName = ref('');
const modelSearch = () => {
    //console.log('🔍 자식: 조회 버튼 클릭됨', modelCode.value, revision.value, modelName.value);
    // 입력값을 부모한테 전달
    emit('search', {
        code: modelCode.value,
        revision: revision.value,
        name: modelName.value
    });
};
const tossModel = () => {
    emit('toss');
};
</script>

<template>
    <Toolbar class="mb-6">
        <template #start>
            <div class="flex flex-col gap-2 w-full">
                <!-- 첫 번째 줄 -->
                <div class="grid grid-cols-12 gap-2 items-center">
                    <label for="modelCode" class="col-span-1 flex items-center">제품코드</label>
                    <div class="col-span-3">
                        <InputText v-model="modelCode" id="modelCode" type="text" class="w-full" />
                    </div>
                    <div class="col-span-1"></div>
                    <label for="revision" class="col-span-1 flex items-center">리비전</label>
                    <div class="col-span-3">
                        <InputText v-model="revision" id="revision" type="text" class="w-full" />
                    </div>
                </div>

                <!-- 두 번째 줄 -->
                <div class="grid grid-cols-12 gap-2 items-center">
                    <label for="modelName" class="col-span-1 flex items-center">제품명</label>
                    <div class="col-span-8">
                        <InputText v-model="modelName" id="modelName" type="text" class="w-full" />
                    </div>
                </div>
            </div>
        </template>

        <template #end>
            <div class="flex gap-1 items-center">
                <Button label="저장" @click="tossModel" />
                <Button label="조회" @click="modelSearch" />
            </div>
        </template>
    </Toolbar>
</template>
<style scoped>
.card.flex.flex-col.gap-1 {
    padding: 5px;
}
.flex.items-center {
    margin-left: 20px;
    margin-right: 20px;
}
button {
    margin-right: 10px;
    width: 100px;
    height: 50px;
}
</style>
