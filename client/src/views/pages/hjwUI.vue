<template>
    <div class="card flex flex-col gap-4">
        <div class="font-semibold text-xl">구분1</div>
        <div class="flex flex-wrap gap-4">
            <div class="flex flex-col grow basis-0 gap-2">
                <label for="name2">Name</label>
                <InputText style="width: 500px" id="name2" type="text" />
            </div>
            <div class="flex flex-col grow basis-0 gap-2">
                <label for="email2">Email</label>
                <InputText style="width: 500px" id="email2" type="text" />
            </div>
        </div>
    </div>

    <label for="email3" class="flex items-center col-span-12 mb-2 md:col-span-1 md:mb-0">제품분류</label>
    <div class="flex flex-col md:flex-row gap-4">
        <div class="flex items-center">
            <RadioButton id="option1" name="option" value="Chicago" v-model="radioValue" />
            <label for="option1" class="flex items-center col-span-12 mb-2 md:col-span-1 md:mb-0">완제품</label>
        </div>
        <div class="flex items-center">
            <RadioButton id="option2" name="option" value="Los Angeles" v-model="radioValue" />
            <label for="option2" class="flex items-center col-span-12 mb-2 md:col-span-1 md:mb-0">반제품</label>
        </div>
    </div>
</template>

<script></script>
