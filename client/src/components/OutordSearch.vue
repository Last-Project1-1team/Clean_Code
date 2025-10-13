<script setup>
import { onMounted, ref } from 'vue';

const emit = defineEmits(['submit', 'toss']); // 부모에 알릴 이벤트 정의
const custCode = ref('');
const custName = ref('');
const today = ref(new Date()); // 오늘 날짜

onMounted(async () => {
    emit('submit', { date: today.value });
});
// 버튼 클릭 시 부모로 데이터 전달
const selectOutord = () => {
    emit('submit', { date: today.value });
};
const tossItem = () => {
    emit('toss');
};
</script>
<template>
    <Toolbar class="mb-6">
        <template #start>
            <div class="grid grid-cols-12 gap-2">
                <label for="itemCode" class="flex items-center">발주일자</label>
                <div class="col-span-2">
                    <DatePicker v-model="today" class="w-full" name="outordDate" dateFormat="yy-mm-dd" showIcon showButtonBar iconDisplay="input" inputId="condisplay" />
                </div>
            </div>
        </template>
        <template #end>
            <Button label="저장" @click="tossItem"></Button>
            <Button label="조회" @click="selectOutord"></Button>
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
