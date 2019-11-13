<template>
  <div>
     <el-button type="primary" @click="dialogFormVisible=true">添加数据</el-button>
      <el-table
    :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%">
    <el-table-column
      label="备注"
      prop="remark">
    </el-table-column>
    <el-table-column
      label="类型"
      prop="type">
    </el-table-column>
    <el-table-column
      align="right">
  
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
  
<el-dialog title="收货地址" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="备注" :label-width="formLabelWidth">
      <el-input v-model="form.remark" autocomplete="off"></el-input>
    </el-form-item>
   <el-form-item label="类型" :label-width="formLabelWidth">
      <el-input v-model="form.type" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="备注" :label-width="formLabelWidth">
      <el-input v-model="form.sort" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="add">确 定</el-button>
  </div>
</el-dialog>
<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      
      :page-sizes="[2, 3, 4, 5]"
      :page-size="100"
      layout="sizes, prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
  
</template>
<script>
import axios from "axios"
export default {
  props:{

  },
  components:{

  },
  data(){
    return {
         tableData: [],
        search: '',
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
         remark:"",
         type:"",
         sort:""
        },
        formLabelWidth: '120px',
        id:null,
        limit:2,
        pagenum:1,
        total:0
    }
  },
  computed:{

  },
  methods:{
     handleSizeChange(val) {
       this.limit=val
        console.log(`每页 ${val} 条`);
        this.getList()
      },
      handleCurrentChange(val) {
        this.pagenum=val
        this.getList()
        this.clears()
        console.log(`当前页: ${val}`);
      },
    add(){
      let url=""
      if(this.id)
      {
        url="/api/updata"
      }
      else{
        url="/api/add"
        this.clears()
      }
      if(this.form.type!=""&&this.form.type!="")
      {
        axios.post(url,{...this.form,id:this.id}).then(res=>{
        console.log(res)
         alert(res.data.msg)
         this.getList()
        this.dialogFormVisible=false
        
      })
      }else{
        alert("请确认参数")
      }
      
    },
    getList() {
        axios.get("/api/list",{params:{pagenum:this.pagenum,limit:this.limit}}).then(res=>{
          console.log(res.data.total)
          this. tableData=res.data.data.data
          this.total=res.data.total
        })
    },
     handleEdit(index, row) {
        console.log(index, row);
        this.dialogFormVisible=true
        this.id=row.id
         this.form={
         remark:row.remark,
         type:row.type,
         sort:row.sort
        }
      },
      handleDelete(index, row) {
        console.log(index, row);
        console.log(row.id)
        axios.get("/api/del?id="+row.id).then(res=>{
          console.log(res)
          this.getList()
        })
      },
      clears()
      {
        this.form={
         remark:"",
         type:"",
         sort:""
        }      }
  },
  created(){
    this.getList()
  },
  mounted(){

  }
}
</script>
<style scoped lang="">

</style>