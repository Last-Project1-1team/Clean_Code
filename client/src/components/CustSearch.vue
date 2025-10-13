<script setup>
import { ref } from 'vue';

const emit = defineEmits(['submit', 'toss']); // 부모에 알릴 이벤트 정의
const custCode = ref('');
const custName = ref('');

// 버튼 클릭 시 부모로 데이터 전달
const selectCust = () => {
    emit('submit', { code: custCode.value, name: custName.value });
};
const tossCust = () => {
    emit('toss');
};
</script>
<template>
    <Toolbar class="mb-6">
        <template #start>
            <div class="grid grid-cols-12 gap-2">
                <label for="itemCode" class="flex items-center">업체코드</label>
                <div class="col-span-4">
                    <InputText id="custCode" type="text" class="w-full" v-model="custCode" />
                </div>

                <label for="itemName" class="flex items-center">업체명</label>
                <div class="col-span-4">
                    <InputText id="custName" type="text" class="w-full" v-model="custName" />
                </div>
            </div>
        </template>
        <template #end>
            <Button label="저장" @click="tossCust"></Button>
            <Button label="조회" @click="selectCust"></Button>
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
