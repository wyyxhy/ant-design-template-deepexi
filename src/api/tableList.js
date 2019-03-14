import { post, get, put, del } from '../utils/request'

export default {
    getTableList(name = '') {
        return get(`/users/${name}`)
    },
    putTableData(data) {
        return put('/user', data)
    },
    deleteTableData(data) {
        return del('/user', {data})
    },
    postTableData(data) {
        return post('/user', data)
    },
}