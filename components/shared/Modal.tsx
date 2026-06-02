"use client";
// components/shared/Modal.tsx — wrapper shadcn Dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "sm:max-w-md", md: "sm:max-w-xl", lg: "sm:max-w-3xl" };

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${sizeMap[size]} max-h-[85vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="text-base font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-1">{children}</div>
      </DialogContent>
    </Dialog>
  );
}