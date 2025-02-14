import React from "react";
import { Button } from "./button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <p className="text-onyx">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            onClick={onClose}
            variant="secondary"
            className="bg-cloakGrey text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="primary"
            className="bg-certFillBlue text-white"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};
