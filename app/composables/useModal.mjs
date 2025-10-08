export const useModal = () => {
    const activeModal = ref(null)

    const openModal = (modalType, data = null) => {
        activeModal.value = { type: modalType, data }
    }

    const closeModal = () => {
        activeModal.value = null
    }

    const isModalOpen = (modalType) => {
        return activeModal.value?.type === modalType
    }

    return {
        activeModal: readonly(activeModal),
        openModal,
        closeModal,
        isModalOpen
    }
}