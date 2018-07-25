import Vue from 'vue'
import Component from './func-notification'

const NotificationConstructor = Vue.extend(Component)
let instances = []
let seed = 1
const removeInstance = (instance) => {
  if (!instance) return
  const len = instances.length
  const index = instances.findIndex(val => val.id === instance.id)
  instances.splice(index, 1)

  if (len <= 1) return
  const removeHeight = instance.vm.height
  for (let i = index; i < len - 1; i++) {
    let instancesI = instances[i]
    instancesI.verticalOffset = parseInt(instancesI.verticalOffset) - removeHeight - 16
  }
}
const notify = (options) => {
  // 判断是不是服务端渲染 如果死服务端渲染 dom就不能操作所以要return出来
  if (Vue.prototype.$isServer) return
  const {
    autoClose,
    ...rest
  } = options
  const instance = new NotificationConstructor({
    propsData: {
      ...rest
    },
    data: {
      autoClose: autoClose === undefined ? 3000 : autoClose
    }
  })

  // 这个id用于删除notify的标识
  instance.id = `notification_${seed++}`
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.flag = true

  // 计算每个instance所在的 bottom 所在的位置
  let verticalOffset = 0
  instances.forEach(val => {
    verticalOffset += val.$el.offsetHeight + 16
  })
  verticalOffset += 16
  instance.verticalOffset = verticalOffset
  instances.push(instance)
  instance.vm.$on('closed', () => {
    removeInstance(instance)
    document.body.removeChild(instance.vm.$el)
    instance.vm.$destroy()
  })
  instance.vm.$on('close', () => {
    instance.vm.flag = false
  })
  return instance.vm
}
export default notify
