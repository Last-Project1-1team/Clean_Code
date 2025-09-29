<template>
    <div class="card flex flex-col gap-1">
        <div class="grid grid-cols-12 gap-2">
            <label for="itemName" class="flex items-center">자재코드</label>
            <div class="col-span-3">
                <InputText id="itemName" type="text" class="w-full" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="itemName" class="flex items-center">자재명</label>
            <div class="col-span-7">
                <InputText id="itemName" type="text" class="w-full" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="spec" class="flex items-center">상세규격</label>
            <div class="col-span-7">
                <InputText id="itemName" type="text" class="w-full" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="spec" class="flex items-center">자재분류</label>
            <AutoComplete class="col-span-3" v-model="selectedAutoValue" :suggestions="autoFilteredValue" optionLabel="name" dropdown display="chip" />

            <label for="unit" class="flex items-center">단위</label>
            <AutoComplete class="col-span-3" v-model="selectedAutoValue" :suggestions="autoFilteredValue" optionLabel="name" dropdown display="chip" />
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="lotPQty" class="flex items-center">LOT당수량</label>
            <div class="col-span-3">
                <InputText id="lotPQty" type="text" class="w-full" />
            </div>
            <label for="eaPQty" class="flex items-center">EA단위수량</label>
            <div class="col-span-3">
                <InputText id="eaPQty" type="text" class="w-full" />
            </div>
        </div>
        <div class="grid grid-cols-12 gap-2">
            <label for="safetyStock" class="flex items-center">안전재고</label>
            <div class="col-span-3">
                <InputText id="safetyStock" type="text" class="w-full" />
            </div>
            <label for="eaPQty" class="flex items-center">사용여부</label>
            <div class="col-span-3">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex items-center">
                        <RadioButton id="option1" name="useYn" value="Y" v-model="radioValue" />
                        <label for="option1" class="leading-none ml-2">Y</label>
                    </div>
                    <div class="flex items-center">
                        <RadioButton id="option2" name="useYn" value="N" v-model="radioValue" />
                        <label for="option2" class="leading-none ml-2">N</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup></script>

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
