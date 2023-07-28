// App.js

import {h} from "../../lib/mini-vue.esm.js";
window.self = null
export default {
  render() {
    window.self = this
    return h('div', {style:'color:blue'},'hi ' + this.title)
  },
  setup() {
    return {
      title: 'mini-vue',
    }
  },
}