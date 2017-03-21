import Router from "vue-router"

/* 模板 */
import Home from "./components/Home.vue"
import ListDetail from "./components/ListDetail.vue"
import AlbumList from "./components/AlbumList.vue"

let router=new Router({
    mode:"history",
    routes:[
        {path:"/",component:Home},
        {path:"/list/:id",component:ListDetail},
        {path:"/album/:id",component:AlbumList}
    ]
})

export {Router,router}