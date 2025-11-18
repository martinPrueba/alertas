import { ref } from "vue";

const alertMessage = ref(null);

export function useGlobalAlert() {
  const showAlert = (msg) => {
    alertMessage.value = msg;
  };

  const clearAlert = () => {
    alertMessage.value = null;
  };

  return {
    alertMessage,
    showAlert,
    clearAlert
  };
}
