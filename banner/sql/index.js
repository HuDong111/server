let koa = require('koa')
let app = new koa()
let router = require('koa-router')()
let bodyparser = require('koa-bodyparser')
let query = require('./db/query')
app.use(bodyparser())
app.use(router.routes())
router.get('/api/list', async ctx => {
  let {pagenum,limit}=ctx.query
  console.log(pagenum,limit)
  let Startindex=(pagenum-1)*limit
  let total=await query("select count(*) from list")
  console.log(total.data[0]["count(*)"])
  let data = await query(`select * from list limit ${Startindex},${limit}`)
  console.log(data)
  ctx.body = {
    data:data,
    total:total.data[0]["count(*)"]
  }
})
router.get('/api/del', async ctx => {
  let { id } = ctx.query
  console.log(id)
  let res = await query('select * from list where id=?', [id])

  if (id) {
    if (res.data.length != 0) {
      try {
        await query('delete from list where id=?', [id])
        ctx.body = {
          code: 1,
          msg: '删除成功'
        }
      } catch (e) {
        ctx.body = {
          code: 0,
          msg: e.error
        }
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '此数据不存在'
      }
    }
  } else {
    ctx.body = {
      code: 3,
      msg: '请确认参数'
    }
  }
})
router.post('/api/add', async ctx => {
  let { remark, type } = ctx.request.body

  if (remark && type) {
    let newdata = new Date()
    try {
      await query('insert into list (remark,type,create_time) values (?,?,?)', [
        remark,
        type,
        newdata
      ])
      ctx.body = {
        code: 1,
        msg: '添加成功'
      }
    } catch (e) {
      ctx.body = {
        code: 0,
        msg: e.error
      }
    }
  } else {
    ctx.body = {
      code: 4,
      msg: '请确认参数'
    }
  }
})

router.post('/api/updata', async ctx => {//修改接口
  let { remark, type, id } = ctx.request.body //接受参数
  if (remark && type && id) {
    //判断参数是否存在
    //存在
    let res = await query('select * from list where id=?', [id]) //在list里面查询id
    //res 返回的是对象{msg:"success",data:[]}
    let newdata = new Date() //定义创建的时间
    if (res.data.length == 0) {
      //如果res中的data长度weiling说明此id不存在
      ctx.body = {
        code: 4,
        msg: '此项数据不存在'
      }
    } else {
      //如果id存在
      try {
        //修改id所在一行的数据
        //sel update 表名 set 字段1=?,字段2=?,字段3=? where id=?"
        await query(
          'update list set remark=?,type=?,create_time=? where id=?',
          [remark, type, newdata, id]
        )
        ctx.body = {
          code: 1,
          msg: '修改成功'
        }
      } catch (e) {
        ctx.body = {
          code: 0,
          msg: e.error
        }
      }
    }
  } else {
    //参数不存在
    ctx.body = {
      code: -1,
      msg: '请确认参数'
    }
  }
})

router.get('/api/sort', async ctx => {
  let data = await query('select * from list order by sort desc')
  console.log(data)
  ctx.body = data
})
app.listen(3000, () => {
  console.log('3000端口启动成功')
})
