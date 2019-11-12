let koa=require("koa")
let app=new koa()
let router=require("koa-router")()
let query=require("./mysql/query.js")
let bodyparser=require("koa-bodyparser")

app.use(bodyparser())
router.get("/api/list",async (ctx,next)=>{
    ctx.body=await query("select * from list")
})
router.post("/api/del",async (ctx)=>{
    let {id}=ctx.request.body
    console.log(id)
    let res=await query("select * from list where id=?",[id])
    console.log(res.data.length)
    if(res.data.length===0)
    {
        console.log(1)
        ctx.body={
            code:3,
            msg:"不存在"
        }
    }
    else{
        flag=await query("DELETE FROM list WHERE id = ?;",[id])
        if(flag)
        {
            ctx.body={
                code:1,
                msg:"删除成功"
            }
        }else{
            ctx.body={
                code:0,
                mag:"删除失败"
            }
        }
    }
    
})

router.post("/api/add",async (ctx)=>{
    let {title,auther,num,type} = ctx.request.body
    if(title&&auther&&num&&type)
    {
        let data=await query("INSERT INTO list (title,auther,num,type) VALUES(?,?,?,?);",[title,auther,num,type])
        if(data)
        {
            ctx.body={
                code:1,
                msg:"添加成功"
            }
        }else{
             ctx.body={
                 code:0,
                 msg:"添加失败"
             }
        }
    }
    else{
        ctx.body={
            code:3,
            msg:"请确认参数"
        }
    }
})

router.post("/api/update",async (ctx)=>{
    let {title,auther,num,type,id}=ctx.request.body
    if(title&&auther&&num&&type&&id)
    {
        let res=await query("select * from list where id=?",[id])
        if(res.data.length)
        {
            let data=await query("update list set list.title=?,list.auther=?,list.num=?,list.type=? where id=?",[title,auther,num,type,id])
            console.log(data)
            if(data){
                ctx.body={
                    code:1,
                    msg:"修改成功"
                }
            }else{
                ctx.body={
                    code:0,
                    msg:"修改失败"
                }
            }
        }
        else{
            ctx.body={
                code:4,
                msg:"此id不存在"
            }
            
        }
      
    }else{
        ctx.body={
            code:3,
            msg:"请确认参数"
        }
    }
})
app.use(router.routes())

app.listen(3000,()=>{
    console.log("3000端口启动成功")
})


