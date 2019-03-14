<template>
  <div class="tableList">
    <a-input-search placeholder="请输入名称" style="width: 200px" @search="onSearch"/>
    <div class="list-button">
      <span>
        <a-button type="primary" @click="handleAdd">添 加</a-button>
      </span>
      <span>
        <a-button type="danger" @click="handleDelList">删 除</a-button>
      </span>
    </div>

    <a-table
      :dataSource="data"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :loading="getListLoading">
      <a-table-column title="ID" data-index="id" key="id"/>
      <a-table-column title="名称" data-index="name" key="name"/>
      <a-table-column title="角色" data-index="role" key="role"></a-table-column>
      <a-table-column title="权限" data-index="enable" key="enable">
        <template slot-scope="enable,record">
          <span>
            <a-switch :checked="enable" @change="handleChangeEnable(record)"/>
          </span>
        </template>
      </a-table-column>
      <a-table-column title="操作" key="operation">
        <template slot-scope="record">
          <span style="padding-right:10px">
            <a-button type="primary" @click="handleEdit(record)">编辑</a-button>
          </span>
          <a-button type="danger" @click="handleDelete(record)">删 除</a-button>
        </template>
      </a-table-column>
    </a-table>
    <a-modal
      :title="(methodeType === 'add' ? '添加' : '更改')+'用户信息'"
      :visible="visible"
      :footer="null"
      @cancel="handleCancel">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="ID" :label-col="{ span: 5 }" :wrapper-col="{ span: 8 }">
          <a-input-number
            v-decorator="[
                    'id',
                    {rules: [{ required: true, message: '请输入ID!' }],
                    initialValue: list.id
                    }]"/>
        </a-form-item>
        <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="[
                    'name',
                    {rules: [{ required: true, message: '请输入名称!' }],
                    initialValue: list.name
                    }]"/>
        </a-form-item>
        <a-form-item label="角色" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            v-decorator="[
                    'role',
                    {rules: [{ required: true, message: '请选择角色!' }],
                    initialValue: list.role
                    }]"
            placeholder="请选择角色">
            <a-select-option value="1">角色1</a-select-option>
            <a-select-option value="2">角色2</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="权限" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            v-decorator="[
                    'enable',
                    {rules: [{ required: true, message: '请选择权限!' }],
                    initialValue: list.enable
                    }]"
            placeholder="请选择权限">
            <a-select-option value="1">有</a-select-option>
            <a-select-option value="0">没有</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit" :loading="submitLoading">确认更改</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'TableList',
  components: {},
  data () {
    return {
      data: [],
      pagination: {},
      submitLoading: false,
      getListLoading: false,
      visible: false,
      form: this.$form.createForm(this),
      list: {},
      methodeType: 'add',
      selectedRowKeys: []
    }
  },
  mounted () {
    this.getTableList()
  },

  methods: {
    onSearch (name) {
      this.getTableList(name)
    },
    handleEdit (record) {
      const t = this
      const formData = Object.assign({}, record)
      formData.enable = formData.enable ? '1' : '0'
      t.list = formData
      t.methodeType = 'edit'
      t.visible = true
    },
    handleDelete (record) {
      this.deleteTableData([record._id])
    },

    handleCancel () {
      const t = this
      t.visible = false
      t.list = {}
    },

    handleAdd () {
      const t = this
      t.visible = true
      t.methodeType = 'add'
    },

    handleDelList () {
      const t = this
      if (!t.selectedRowKeys.length) {
        t.$message.warning('请选择需要删除的项！')
        return
      }

      const ids = t.selectedRowKeys.map(item => {
        return t.data[item]._id
      })
      t.deleteTableData(ids).then(() => {
        t.selectedRowKeys = []
      })
    },

    handleSubmit (e) {
      const t = this
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.enable = values.enable === '1'
          values._id = t.list._id
          t.submitLoading = true
          let method
          if (t.methodeType === 'add') {
            method = t.putTableData(values)
          } else {
            method = t.postTableData(values)
          }
          method.then(() => {
            t.visible = false
            t.submitLoading = false
            t.list = {}
            t.form.resetFields()
          })
        }
      })
    },

    handleChangeEnable (record) {
      const t = this
      const data = Object.assign({}, record)
      data.enable = !data.enable
      t.postTableData(data).then(() => {
        t.getTableList()
      })
    },

    onSelectChange (changes) {
      this.selectedRowKeys = changes
    },

    getTableList (name) {
      const t = this
      t.getListLoading = true
      return t.$api.tableList.getTableList(name).then(res => {
        t.data = res
        t.getListLoading = false
      })
    },

    deleteTableData (ids) {
      const t = this
      return t.$api.tableList.deleteTableData({ _id: ids }).then(() => {
        return t.getTableList()
      })
    },

    putTableData (data) {
      const t = this
      return t.$api.tableList.putTableData(data).then(() => {
        return t.getTableList()
      })
    },

    postTableData (data) {
      const t = this
      return t.$api.tableList.postTableData(data).then(() => {
        return t.getTableList()
      })
    }
  }
}
</script>

<style scoped>
.tableList {
  width: 700px;
  margin: 0 auto;
  padding-top: 30px;
}
.list-button {
  padding: 20px 0;
}
.list-button > span {
  padding-right: 20px;
}
</style>
