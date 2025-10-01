<script setup>
import { ref } from 'vue';
</script>

<template>
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <!-- 화면 상단 제품 검색 부분-->
                <div class="grid grid-cols-12 gap-2">
                    <label for="modelCode" class="flex items-center col-span-2 mb-2 md:mb-0">생산계획코드</label>
                    <AutoComplete
                        class="flex items-center col-span-4 mb-2 md:mb-0"
                        v-model="selectedAutoValue"
                        :suggestions="autoFilteredValue"
                        optionLabel="name"
                        placeholder="Search"
                        dropdown
                        multiple
                        display="chip"
                        @complete="searchCountry($event)"
                    />
                </div>
            </template>
            <template #end>
                <Button label="출력" class="p-button-outlined px-6 py-3 text-lg font-bold" />
                <Button label="저장" class="p-button-outlined px-6 py-3 text-lg font-bold" />
                <Button label="조회" class="p-button-outlined px-6 py-3 text-lg font-bold" />
            </template>
        </Toolbar>
    </div>
</template>
