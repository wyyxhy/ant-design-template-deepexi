import user from './user'
import tableList from './tableList'

const api = {
  user,
  tableList
}
export default {
  ...api,
  install: Vue => {
    Vue.prototype.$api = api
  }
}
