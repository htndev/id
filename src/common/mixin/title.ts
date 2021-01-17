import { PROJECT_TITLE } from '@/common/constants';

function getTitle(vm: any) {
  if (vm.title && typeof vm.title === 'function') {
    return `${PROJECT_TITLE} – ${vm.title.call(vm)}`;
  }
}
export default {
  created() {
    const title = getTitle(this);
    if (title) {
      document.title = title;
    }
  }
};
