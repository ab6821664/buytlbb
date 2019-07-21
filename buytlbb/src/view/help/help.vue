<template>
    <div>
    <v-nav></v-nav>
        <h4 style="margin-top: 15px">如还有问题请咨询站长，微信：13715549992</h4>
    <div style="margin-top: 50px;width: 100%">
        <video src="./../../assets/main.mp4" controls preload="auto"></video>
    </div>
    </div>
</template>

<script>
    import nav from '../../components/nav'
    export default {
        name: "help",
        components:{
            'v-nav':nav,
        },
    }
</script>

<style scoped>

</style>