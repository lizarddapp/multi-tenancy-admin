import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  useModalStore,
  useCreateModal,
  useEditModal,
  useConfirmModal,
} from "~/lib/stores/useModalStore";

export function ModalExamples() {
  const { openModal, closeModal } = useModalStore();
  const { openCreateModal } = useCreateModal();
  const { openEditModal } = useEditModal();
  const { openConfirmModal } = useConfirmModal();

  // Example 1: Simple confirmation modal
  const handleSimpleConfirm = () => {
    openConfirmModal(
      <div className="space-y-4">
        <p>Are you sure you want to proceed with this action?</p>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => closeModal("confirm-modal")}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              alert("Action confirmed!");
              closeModal("confirm-modal");
            }}
          >
            Confirm
          </Button>
        </div>
      </div>,
      {
        title: "Confirm Action",
        size: "sm",
      }
    );
  };

  // Example 2: Create form modal
  const handleCreateForm = () => {
    openCreateModal(
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Form submitted!");
          closeModal("create-modal");
        }}
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter email" />
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => closeModal("create-modal")}
          >
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>,
      {
        title: "Create New Item",
        description: "Fill in the details below to create a new item.",
        size: "lg",
        maxHeight: "75vh",
      }
    );
  };

  // Example 3: Custom modal with custom ID
  const handleCustomModal = () => {
    openModal({
      id: "custom-modal-123",
      title: "Custom Modal",
      size: "2xl",
      maxHeight: "600px",
      content: (
        <div className="space-y-4">
          <p>This is a custom modal with a custom ID and fixed max height.</p>
          <p>You can have multiple modals open at the same time!</p>
          <div className="bg-muted p-4 rounded">
            <h4 className="font-semibold">Features:</h4>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Custom modal IDs</li>
              <li>Multiple modals support</li>
              <li>Flexible sizing</li>
              <li>Custom max height (600px)</li>
              <li>Custom content</li>
              <li>Overlay click control</li>
              <li>Escape key control</li>
              <li>Automatic scrolling when content overflows</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded mt-4">
            <p className="text-sm">
              This modal has a fixed max height of 600px. If the content is
              longer than this, it will scroll automatically.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => closeModal("custom-modal-123")}>
              Close
            </Button>
          </div>
        </div>
      ),
      closeOnOverlayClick: false,
    });
  };

  // Example 4: Nested modals
  const handleNestedModal = () => {
    openModal({
      id: "parent-modal",
      title: "Parent Modal",
      size: "lg",
      content: (
        <div className="space-y-4">
          <p>This is the parent modal.</p>
          <Button
            onClick={() => {
              openModal({
                id: "child-modal",
                title: "Child Modal",
                size: "sm",
                content: (
                  <div className="space-y-4">
                    <p>This is a child modal opened from the parent!</p>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => closeModal("child-modal")}
                      >
                        Close Child
                      </Button>
                      <Button
                        onClick={() => {
                          closeModal("child-modal");
                          closeModal("parent-modal");
                        }}
                      >
                        Close Both
                      </Button>
                    </div>
                  </div>
                ),
              });
            }}
          >
            Open Child Modal
          </Button>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => closeModal("parent-modal")}
            >
              Close Parent
            </Button>
          </div>
        </div>
      ),
    });
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Modal Store Examples</h2>
      <p className="text-muted-foreground">
        These examples demonstrate how to use the modal store for different
        scenarios.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Button onClick={handleSimpleConfirm} variant="outline">
          Simple Confirmation
        </Button>

        <Button onClick={handleCreateForm} variant="outline">
          Create Form Modal
        </Button>

        <Button onClick={handleCustomModal} variant="outline">
          Custom Modal
        </Button>

        <Button onClick={handleNestedModal} variant="outline">
          Nested Modals
        </Button>
      </div>
    </div>
  );
}
