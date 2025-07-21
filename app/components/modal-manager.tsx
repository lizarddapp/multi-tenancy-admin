import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useModalStore } from "~/lib/stores/useModalStore";

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl",
  "6xl": "sm:max-w-6xl",
  "7xl": "sm:max-w-7xl",
};

export function ModalManager() {
  const { modals, closeModal } = useModalStore();

  return (
    <>
      {modals.map((modal) => (
        <Dialog
          key={modal.id}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              closeModal(modal.id);
            }
          }}
        >
          <DialogContent
            className={`${
              sizeClasses[modal.size || "lg"]
            } p-0 flex flex-col max-h-[90vh] ${
              modal.size === "sm" || modal.size === "md" ? "h-auto" : "h-auto"
            }`}
            style={{
              maxHeight: modal.maxHeight || "90vh",
            }}
            onPointerDownOutside={(e) => {
              if (modal.closeOnOverlayClick === false) {
                e.preventDefault();
              }
            }}
            onEscapeKeyDown={(e) => {
              if (modal.closeOnEscape === false) {
                e.preventDefault();
              }
            }}
          >
            {modal.showHeader !== false &&
              (modal.title || modal.description) && (
                <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
                  {modal.title && <DialogTitle>{modal.title}</DialogTitle>}
                  {modal.description && (
                    <DialogDescription>{modal.description}</DialogDescription>
                  )}
                </DialogHeader>
              )}

            {modal.size === "sm" || modal.size === "md" ? (
              // For small modals, use simple div with auto height
              <div className="px-6 pb-6">{modal.content}</div>
            ) : (
              // For larger modals, use ScrollArea with fixed height
              <div className="flex-1 min-h-0">
                <ScrollArea
                  style={{
                    height: `calc(${modal.maxHeight || "90vh"} - 160px)`,
                  }}
                >
                  <div className="pb-6">{modal.content}</div>
                </ScrollArea>
              </div>
            )}

            {modal.showFooter !== false && modal.footer && (
              <div className="flex justify-end space-x-2 px-6 pb-6 pt-4 flex-shrink-0 border-t">
                {modal.footer}
              </div>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}
