<template>
    <Toolbar class="mb-6">
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
            <Button label="조회" @click="selectItem"></Button>
        </template>
    </Toolbar>
</template>
<script setup>
import { ref } from 'vue';

const emit = defineEmits(['submit']); // 부모에 알릴 이벤트 정의
const itemCode = ref('');
const itemName = ref('');

// 버튼 클릭 시 부모로 데이터 전달
const selectItem = () => {
    emit('submit', { code: itemCode.value, name: itemName.value });
};
</script>

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
