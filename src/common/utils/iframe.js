export const closePage = () => {
  if (typeof window.parent?.closePage === 'function') {
    window.parent.closePage()
  }
}
