# Modal Store Documentation

A centralized modal management system using Zustand that eliminates the need to manage Dialog components in every page.

## Features

- ✅ **Centralized Management**: Single store for all modals
- ✅ **Multiple Modals**: Support for multiple modals open simultaneously
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Flexible Sizing**: 8 different size options
- ✅ **Custom Content**: Any React component as modal content
- ✅ **Convenience Hooks**: Pre-configured hooks for common patterns
- ✅ **Global Access**: Available throughout the entire application
- ✅ **No Boilerplate**: No need to manage Dialog state in components

## Installation

The modal store is already set up in the application. The `ModalManager` component is included in the root layout.

## Basic Usage

### 1. Using Convenience Hooks

```tsx
import {
  useCreateModal,
  useEditModal,
  useConfirmModal,
} from "~/lib/stores/useModalStore";

function MyComponent() {
  const { openCreateModal, closeCreateModal } = useCreateModal();
  const { openEditModal, closeEditModal } = useEditModal();
  const { openConfirmModal, closeConfirmModal } = useConfirmModal();

  const handleCreate = () => {
    openCreateModal(<MyCreateForm onCancel={closeCreateModal} />, {
      title: "Create New Item",
      size: "lg",
    });
  };

  return <Button onClick={handleCreate}>Create</Button>;
}
```

### 2. Using the Main Store

```tsx
import { useModalStore } from "~/lib/stores/useModalStore";

function MyComponent() {
  const { openModal, closeModal } = useModalStore();

  const handleCustomModal = () => {
    openModal({
      id: "my-custom-modal",
      title: "Custom Modal",
      content: <div>My custom content</div>,
      size: "xl",
      onClose: () => console.log("Modal closed"),
    });
  };

  return <Button onClick={handleCustomModal}>Open Modal</Button>;
}
```

## Modal Configuration

```tsx
interface ModalConfig {
  id: string; // Unique identifier
  title?: string; // Modal title
  description?: string; // Modal description
  content: ReactNode; // Modal content
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
  maxHeight?: string; // Custom max height (e.g., "80vh", "600px")
  showHeader?: boolean; // Show/hide header (default: true)
  showFooter?: boolean; // Show/hide footer (default: true)
  footer?: ReactNode; // Custom footer content
  onClose?: () => void; // Callback when modal closes
  closeOnOverlayClick?: boolean; // Allow closing by clicking overlay (default: true)
  closeOnEscape?: boolean; // Allow closing with Escape key (default: true)
}
```

## Size Options

| Size  | Max Width               |
| ----- | ----------------------- |
| `sm`  | `sm:max-w-sm` (384px)   |
| `md`  | `sm:max-w-md` (448px)   |
| `lg`  | `sm:max-w-lg` (512px)   |
| `xl`  | `sm:max-w-xl` (576px)   |
| `2xl` | `sm:max-w-2xl` (672px)  |
| `3xl` | `sm:max-w-3xl` (768px)  |
| `4xl` | `sm:max-w-4xl` (896px)  |
| `5xl` | `sm:max-w-5xl` (1024px) |
| `6xl` | `sm:max-w-6xl` (1152px) |
| `7xl` | `sm:max-w-7xl` (1280px) |

## Max Height Options

The `maxHeight` property controls the maximum height of the modal content. When content exceeds this height, it becomes scrollable.

### Default Values

- **Create Modal**: `85vh` (85% of viewport height)
- **Edit Modal**: `85vh` (85% of viewport height)
- **Confirm Modal**: `70vh` (70% of viewport height)
- **Custom Modal**: `90vh` (90% of viewport height, if not specified)

### Supported Units

- **Viewport units**: `80vh`, `90vh`, `100vh`
- **Pixels**: `600px`, `800px`, `1000px`
- **Tailwind classes**: `max-h-96`, `max-h-screen`
- **CSS calc**: `calc(100vh - 100px)`

### Examples

```tsx
// Fixed pixel height
openModal({
  id: "my-modal",
  maxHeight: "600px",
  content: <MyContent />,
});

// Viewport percentage
openModal({
  id: "my-modal",
  maxHeight: "75vh",
  content: <MyContent />,
});

// Using calc for complex layouts
openModal({
  id: "my-modal",
  maxHeight: "calc(100vh - 200px)",
  content: <MyContent />,
});
```

## Common Patterns

### Confirmation Dialog

```tsx
const { openConfirmModal, closeConfirmModal } = useConfirmModal();

const handleDelete = () => {
  openConfirmModal(
    <div className="space-y-4">
      <p>Are you sure you want to delete this item?</p>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={closeConfirmModal}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            deleteItem();
            closeConfirmModal();
          }}
        >
          Delete
        </Button>
      </div>
    </div>,
    {
      title: "Confirm Deletion",
      size: "sm",
    }
  );
};
```

### Form Modal

```tsx
const { openCreateModal, closeCreateModal } = useCreateModal();

const handleCreateUser = () => {
  openCreateModal(
    <UserForm
      onSubmit={async (data) => {
        await createUser(data);
        closeCreateModal();
      }}
      onCancel={closeCreateModal}
    />,
    {
      title: "Create New User",
      description: "Fill in the user details below.",
      size: "lg",
    }
  );
};
```

### Multiple Modals

```tsx
const { openModal, closeModal } = useModalStore();

// Open multiple modals with different IDs
openModal({ id: "modal-1", content: <Content1 /> });
openModal({ id: "modal-2", content: <Content2 /> });

// Close specific modal
closeModal("modal-1");

// Close all modals
closeAllModals();
```

## Migration from Dialog Components

### Before (with Dialog components)

```tsx
function OldComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create</Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Item</DialogTitle>
          </DialogHeader>
          <MyForm onCancel={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### After (with Modal Store)

```tsx
function NewComponent() {
  const { openCreateModal, closeCreateModal } = useCreateModal();

  const handleCreate = () => {
    openCreateModal(<MyForm onCancel={closeCreateModal} />, {
      title: "Create Item",
    });
  };

  return <Button onClick={handleCreate}>Create</Button>;
}
```

## Benefits

1. **Less Boilerplate**: No need to manage modal state in every component
2. **Consistent UX**: All modals follow the same patterns
3. **Better Performance**: Modals are rendered only when needed
4. **Easier Testing**: Centralized modal logic is easier to test
5. **Global Access**: Can open modals from anywhere in the app
6. **Multiple Modals**: Support for complex modal workflows
7. **Type Safety**: Full TypeScript support with proper typing
