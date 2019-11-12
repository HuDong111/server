const Koa = require('koa');

const app = new Koa();

const static = require('koa-static');

const path = require('path');

const bodyparser = require('koa-bodyparser');

const router = require('koa-router')();

const query = require('./db/query');

app.use(static(path.join(process.cwd(),'public')));

app.use(bodyparser());  //ctx.request.body

app.use(router.routes());

app.use(router.allowedMethods());

router.get('/api/list',async ctx => {
    let data = await query('select * from userlist');
    if(data.msg === 'error'){
        ctx.body = {
            code:0,
            msg:error
        }
    }else{
        ctx.body = {
            code:1,
            data
        }
    } 
})

router.post('/api/add',async ctx => {
    let {username,password,address,idCard,phone} = ctx.request.body;
    if(username && password && idCard){
        let userData = await query('select * from userlist where idCard=?',[idCard]);
        if(userData.data.length){
            ctx.body = {
                code:3,
                msg:'此人已存在'
            }
        }else{
            let create_time = new Date();
            try{
                await query('insert into userlist (username,password,address,idCard,phone,create_time) values (?,?,?,?,?,?)',[username,password,address,idCard,phone,create_time])
                ctx.body = {
                    code:1,
                    msg:'添加成功'
                }
            }catch(e){
                ctx.body = {
                    code:0,
                    msg:e.error
                }
            }
        }
    }else{
        ctx.body = {
            code:2,
            msg:'缺失参数'
        }
    }    
})

router.get('/api/del',async ctx => {
    let {id} = ctx.query;
    if(id || id === 0){
        try{
            await query('delete from userlist where id=?',[id]);
            ctx.body = {
                code:1,
                msg:'删除成功'
            }
        }catch(e){
            ctx.body = {
                code:0,
                msg:e.error
            }
        }
    }else{
        ctx.body = {
            code:2,
            msg:'缺失参数'
        }
    }
})

router.post('/api/edit',async ctx => {
    let {username,password,address,idCard,phone,id} = ctx.request.body;
    if(username && password && idCard && id){
        try{
            let create_time = new Date();
            await query('update userlist set username=?,password=?,address=?,idCard=?,phone=?,create_time=?where id=?',[])
        }
    }
})


app.listen(process.env.PORT || 3000,() => {
    console.log("服务器启动成功")
}) 


