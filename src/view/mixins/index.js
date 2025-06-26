export default {
    filters: {
        orderTypeFilter(val, code) {
            let v = val
            if (val == undefined || code == undefined) {
                return ''
            }
            for (let key of code) {
                if (key.value == val) {
                    v = key.label
                    break
                } else {
                    v = ''
                }
            }
            return v
        }
    },
}
