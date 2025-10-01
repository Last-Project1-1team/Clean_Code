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
</script>

<template>
    <Toolbar class="mb-6">
        <template #start>
            <!-- 화면 상단 제품 검색 부분-->
            <div class="grid grid-cols-12 gap-2">
                <!-- 제품코드 -->
                <label for="modelCode" class="grid grid-cols-2 flex items-center">제품코드</label>
                <div class="col-span-3">
                    <InputText v-model="modelCode" id="modelCode" type="text" class="w-full" />
                </div>

                <div class="col-span-1"></div>

                <!-- 리비전 -->
                <label for="revision" class="grid grid-cols-2 flex items-center">리비전</label>
                <div class="col-span-3">
                    <InputText v-model="revision" id="revision" type="text" class="w-full" />
                </div>

                <div class="col-span-3"></div>

                <!-- 제품명 -->
                <label for="modelName" class="flex items-center">제품명</label>
                <div class="col-span-8">
                    <InputText v-model="modelName" id="modelName" type="text" class="w-full" />
                </div>
            </div>
        </template>
        <template #end>
            <!-- 조회버튼 -->
            <Button label="조회" icon="pi pi-search" @click="modelSearch"></Button>
        </template>
    </Toolbar>
</template>
<style scoped>
.mb-6 {
    padding: 15px;
}
</style>
