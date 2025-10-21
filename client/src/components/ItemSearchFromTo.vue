<script setup>
import { onMounted, ref } from 'vue';
const emit = defineEmits(['submit', 'toss']); // 부모에 알릴 이벤트 정의
const itemCode = ref('');
const itemName = ref('');
const lastweek = ref(new Date()); // 오늘 날짜
const nextweek = ref(new Date()); // 오늘 날짜
onMounted(async () => {
    emit('submit', { code: itemCode.value, name: itemName.value, lastdate: lastweek.value, nextdate: nextweek.value });
}); // 버튼 클릭 시 부모로 데이터 전달
const selectOutord = () => {
    emit('submit', { code: itemCode.value, name: itemName.value, lastdate: lastweek.value, nextdate: nextweek.value });
};
</script>
<template>
    <Toolbar class="mb-6">
        <template #start>
            <!-- 두 줄 배치 -->
            <div class="flex flex-col gap-2 w-full">
                <!-- 첫 번째 줄 -->
                <div class="grid grid-cols-12 gap-2 items-center">
                    <label for="itemCode" class="col-span-1 text-right">입고일자</label>
                    <div class="col-span-2">
                        <DatePicker v-model="lastweek" class="w-full" dateFormat="yy-mm-dd" showIcon showButtonBar iconDisplay="input" />
                    </div>
                    <div class="col-span-1 text-center">~</div>
                    <div class="col-span-2">
                        <DatePicker v-model="nextweek" class="w-full" dateFormat="yy-mm-dd" showIcon showButtonBar iconDisplay="input" />
                    </div>
                </div>

                <!-- 두 번째 줄 -->
                <div class="grid grid-cols-12 gap-2 items-center">
                    <label for="itemCode" class="col-span-1 text-right">자재코드</label>
                    <div class="col-span-3">
                        <InputText id="itemCode" v-model="itemCode" class="w-full" />
                    </div>

                    <label for="itemName" class="col-span-1 text-right">자재명</label>
                    <div class="col-span-3">
                        <InputText id="itemName" v-model="itemName" class="w-full" />
                    </div>
                </div>
            </div>
        </template>

        <template #end>
            <Button label="조회" @click="selectOutord" />
        </template>
    </Toolbar>
    <!-- <Toolbar class="mb-6">
        <template #start>
            <div class="grid grid-cols-12 gap-2">
                <label for="itemCode" class="flex items-center">입고일자</label>
                <div class="col-span-2"><DatePicker v-model="lastweek" class="w-full" name="outordDate" dateFormat="yy-mm-dd" showIcon showButtonBar iconDisplay="input" inputId="condisplay" /></div>
                <label for="itemCode" class="flex items-center">~</label>
                <div class="col-span-2"><DatePicker v-model="nextweek" class="w-full" name="outordDate" dateFormat="yy-mm-dd" showIcon showButtonBar iconDisplay="input" inputId="condisplay" /></div>
            </div>
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
        <template #end> <Button label="조회" @click="selectOutord"></Button> </template>
    </Toolbar> -->
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
