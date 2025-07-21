import { create } from "zustand";
import React from "react";

export interface ModalConfig {
  id: string;
  title?: string;
  description?: string;
  content: React.ReactNode;
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
  maxHeight?: string; // Custom max height (e.g., "80vh", "600px", "max-h-96")
  showHeader?: boolean;
  showFooter?: boolean;
  footer?: React.ReactNode;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

interface ModalStore {
  modals: ModalConfig[];
  openModal: (config: ModalConfig) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  updateModal: (id: string, updates: Partial<ModalConfig>) => void;
  isModalOpen: (id: string) => boolean;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  modals: [],

  openModal: (config: ModalConfig) => {
    set((state) => ({
      modals: [...state.modals.filter((m) => m.id !== config.id), config],
    }));
  },

  closeModal: (id: string) => {
    const modal = get().modals.find((m) => m.id === id);
    if (modal?.onClose) {
      modal.onClose();
    }
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== id),
    }));
  },

  closeAllModals: () => {
    const { modals } = get();
    modals.forEach((modal) => {
      if (modal.onClose) {
        modal.onClose();
      }
    });
    set({ modals: [] });
  },

  updateModal: (id: string, updates: Partial<ModalConfig>) => {
    set((state) => ({
      modals: state.modals.map((modal) =>
        modal.id === id ? { ...modal, ...updates } : modal
      ),
    }));
  },

  isModalOpen: (id: string) => {
    return get().modals.some((m) => m.id === id);
  },
}));

// Convenience hooks for common modal types
export const useCreateModal = () => {
  const { openModal, closeModal } = useModalStore();

  return {
    openCreateModal: (
      content: React.ReactNode,
      options?: Partial<ModalConfig>
    ) => {
      openModal({
        id: "create-modal",
        title: "Create New",
        size: "lg",
        maxHeight: "85vh",
        showHeader: true,
        closeOnOverlayClick: true,
        closeOnEscape: true,
        content,
        ...options,
      });
    },
    closeCreateModal: () => closeModal("create-modal"),
  };
};

export const useEditModal = () => {
  const { openModal, closeModal } = useModalStore();

  return {
    openEditModal: (
      content: React.ReactNode,
      options?: Partial<ModalConfig>
    ) => {
      openModal({
        id: "edit-modal",
        title: "Edit",
        size: "lg",
        maxHeight: "85vh",
        showHeader: true,
        closeOnOverlayClick: true,
        closeOnEscape: true,
        content,
        ...options,
      });
    },
    closeEditModal: () => closeModal("edit-modal"),
  };
};

export const useConfirmModal = () => {
  const { openModal, closeModal } = useModalStore();

  return {
    openConfirmModal: (
      content: React.ReactNode,
      options?: Partial<ModalConfig>
    ) => {
      openModal({
        id: "confirm-modal",
        title: "Confirm Action",
        size: "sm",
        maxHeight: "70vh",
        showHeader: true,
        closeOnOverlayClick: false,
        closeOnEscape: true,
        content,
        ...options,
      });
    },
    closeConfirmModal: () => closeModal("confirm-modal"),
  };
};
