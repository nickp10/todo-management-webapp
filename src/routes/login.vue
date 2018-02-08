<template>
    <div>
        <h1>{{ title }}</h1>
        <button v-on:click="reverse">Reverse Title</button>
    </div>
</template>

<script>
export default {
    data: function () {
        return { }
    },
    methods: {
        reverse: function() {
            this.title = this.title.split('').reverse().join('');
        }
    }
}
</script>

<style lang="css">
h1 {
    color: blue;
}
</style>