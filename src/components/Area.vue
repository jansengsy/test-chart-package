<template>
    <div id="container">
        <h4>This is an area chart</h4>
        <svg id="chart_svg" :class="uid"></svg>
        <div id="chart_tooltip" :class="uid"></div>
    </div>
</template>

<script>
    export default {
        name: "Area",
        data() {
            return {
                chartData: {},
                loading: false,
                uid: null,
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            loadData() {
                console.log("Load the data: Here we will make an api call to the data end point");
            },
            draw() {
                console.log("This method will trigger the drawing of the chart");
            }
        }
    };
</script>

<style>

</style>