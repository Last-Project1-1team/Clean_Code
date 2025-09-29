<template>
    <Toolbar class="mb-6">
        <template #start>
            <div class="grid grid-cols-12 gap-2">
                <label for="itemCode" class="flex items-center">자재코드</label>
                <div class="col-span-4">
                    <InputText id="itemCode" type="text" class="w-full" />
                </div>

                <label for="itemName" class="flex items-center">자재명</label>
                <div class="col-span-4">
                    <InputText id="itemName" type="text" class="w-full" />
                </div>
            </div>
        </template>
        <template #end>
            <Button label="조회"></Button>
        </template>
    </Toolbar>
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
