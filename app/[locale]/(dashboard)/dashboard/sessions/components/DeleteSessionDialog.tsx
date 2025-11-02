"use client";

import React, { memo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Session } from "@/types/dashboard/sessions.type";

type Props = {
  open: boolean;
  session: Session | null;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
};

const DeleteSessionDialog = memo(function DeleteSessionDialog({
  open,
  session,
  onOpenChange,
  onConfirm,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Session?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete session&nbsp; &quot;
            {session?.session_id}&quot;? This action cannot be undone and will
            remove all&nbsp;
            {session?.messages.length ?? 0} messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

export default DeleteSessionDialog;
