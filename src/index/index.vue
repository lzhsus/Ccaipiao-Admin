<script setup>
import {Notice} from 'view-ui-plus';
import moment from 'moment';
import qs from 'qs'

const state = reactive({
    pageShow: false,
    modal: false,

    columns:[
        { title:"ID",key:"id",width:"70",align:"center" },
        { title:"内容类型",key:"category_id" },
        { title:"问题内容",key:"question_content" },
        { title:"回答内容",key:"answer_content" },
        { title:"是否解决",key:"is_finish" },
        { title:"解决时间",key:"answer_time"  },
        { title:"提问时间",key:"ask_time" }
    ],
    fasD5:[{
        id:1,
        category_id:"3333",
        question_content:"444444",
        answer_content:"444444",
        is_finish:"444444",
        answer_time:"444444",
        ask_time:"444444"
    }],
    page:1,
    pagesize:6,
    totalNum:0,
})

onMounted(async () => {

})
</script>

<template>
<div class="page-head">
    <Card :bordered="false" :dis-hover="true">
        <Card>
            <template #title>
                <Icon type="md-grid" />
                客户反馈
            </template>
            <div style="width: 100%;">
                <Table highlight-row :columns="state.columns" :data="state.fasD5"></Table>
            </div>
        </Card>
    </Card>
</div>
</template>

<style lang="scss">
.echarts-main{
    width: 100%;height: 100%;
}
.page-main {
  display: flex;
  justify-content: center;
  padding: 25px 0 10px;
}
</style>
