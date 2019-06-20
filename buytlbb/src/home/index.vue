<template>
    <div>
        <v-nav></v-nav>
        <div class="main-content">
           <div class="home-account-show">
               <h5><span>账号精准搜索</span></h5>
           </div>
        </div>

    </div>
</template>


<script>
    import navTab from '../components/nav.vue'
    export default {
        name: "index",
        components:{
            "v-nav":navTab
        }
    }
</script>

<style scoped>

</style>