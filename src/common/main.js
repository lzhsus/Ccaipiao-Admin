// https://www.iviewui.com/
import ViewUiPlus from 'view-ui-plus';
import 'view-ui-plus/dist/styles/viewuiplus.css';
import './main.css';

export const main = App => {
  createApp(App).use(ViewUiPlus).mount('#app')
}
