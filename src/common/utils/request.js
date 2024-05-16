import axios from 'axios'
import qs from 'qs'

export const request = axios.create({})

request.interceptors.request.use(config => {
    if ('data' in config && !(config.data instanceof FormData)) {
        config.data = qs.stringify(config.data)
    }

    return config
})

request.interceptors.response.use(({ data }) => {
    if (data.file_url) {
        data = {
            errcode: 0,
            result: {
                file_url: data.file_url,
            },
        }
    }
    if (data.errcode !== 0) {
        const error = new Error(data.msg)
        error.response = data
        throw error
    }

    return data.result
})

// 有的后端接口是 form-data,
// 有的是子字段 json, 所以看情况调用此方法处理 data
export const stringifyData = data => {
    Object.keys(data).forEach(key => {
        if (typeof data[key] === 'object') {
            data[key] = JSON.stringify(data[key])
        }
    })
    return data
}
