<template>
    <div className="card">
        <div class="font-semibold text-xl mb-4">Empty Page</div>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>
    <h3>공통코드</h3>
    <div class="font-semibold text-xl">AutoComplete</div>
    <AutoComplete v-model="selectedAutoValue" :suggestions="autoFilteredValue" optionLabel="name" placeholder="Search" dropdown multiple display="chip" @complete="searchCountry($event)" />
</template>
