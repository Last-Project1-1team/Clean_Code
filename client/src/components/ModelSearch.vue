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
    <div class="card flex flex-col gap-4">
        <!-- 화면 상단 제품 검색 부분-->
        <div class="grid grid-cols-12 gap-2">
            <!-- 제품코드 -->
            <label class="flex items-center col-span-1 mb-2 md:mb-0">제품코드</label>
            <div class="col-span-3">
                <InputText v-model="modelCode" class="w-full" />
            </div>

            <div class="col-span-1"></div>

            <!-- 리비전 -->
            <label class="flex items-center col-span-1 mb-2 md:mb-0">리비전</label>
            <div class="col-span-3">
                <InputText v-model="revision" class="w-full" />
            </div>

            <div class="col-span-2"></div>

            <!-- 조회버튼 -->
            <Button label="조회" icon="pi pi-search" @click="modelSearch" />

            <!-- 제품명 -->
            <label class="flex items-center col-span-1 mb-2 md:mb-0">제품명</label>
            <div class="col-span-8">
                <InputText v-model="modelName" class="w-full" />
            </div>
        </div>
    </div>
</template>
