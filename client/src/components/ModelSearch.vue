<script setup>
import { ref } from 'vue';

const modelCode = ref('');
const revision = ref('');
const modelName = ref('');

// 부모에게 알림만 보냄
const emit = defineEmits(['search']);

function modelSearch() {
    // 입력값을 부모한테 전달
    emit('search', {
        modelCode: modelCode.value,
        revision: revision.value,
        modelName: modelName.value
    });
}
</script>

<template>
    <Toolbar class="mb-6">
        <template #start>
            <!-- 화면 상단 제품 검색 부분-->
            <div class="grid grid-cols-12 gap-2">
                <!-- 제품코드 -->
                <label for="modelCode" class="grid grid-cols-2 flex items-center">제품코드</label>
                <div class="col-span-3">
                    <InputText v-model="modelCode" type="text" class="w-full" />
                </div>

                <div class="col-span-1"></div>

                <!-- 리비전 -->
                <label for="revision" class="grid grid-cols-2 flex items-center">리비전</label>
                <div class="col-span-3">
                    <InputText v-model="revision" type="text" class="w-full" />
                </div>

                <div class="col-span-3"></div>

                <!-- 제품명 -->
                <label for="modelName" class="flex items-center">제품명</label>
                <div class="col-span-8">
                    <InputText v-model="modelName" type="text" class="w-full" />
                </div>
            </div>
        </template>
        <template #end>
            <!-- 조회버튼 -->
            <Button label="조회" icon="pi pi-search" @click="modelSearch"></Button>
            <!--<Button label="조회" icon="pi pi-search" @click="modelSearch" class="p-button-success px-6 py-3 text-lg font-bold" />-->
        </template>
    </Toolbar>
</template>
<style scoped>
.mb-6 {
    padding: 15px;
}
</style>
