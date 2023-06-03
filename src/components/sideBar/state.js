import { ref, computed } from 'vue'

export const collapsed = ref(false)
export const toggleSidebar = () => (collapsed.value = !collapsed.value)
// define the width of the sidebar when expanded and collapse
export const SIDEBAR_WIDTH = 150
export const SIDEBAR_WIDTH_COLLAPSED = 38
//compute the sidebar width based on the value of "collapsed"
export const sidebarWidth = computed(
    () => `${collapsed.value ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH}px`
)