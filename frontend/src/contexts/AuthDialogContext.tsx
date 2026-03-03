import { createContext, useContext, useMemo, useState } from "react";
import AuthDialog from "@/components/auth/AuthDialog";

type AuthTab = "signin" | "signup";

type AuthDialogContextValue = {
  openDialog: (tab?: AuthTab) => void;
  closeDialog: () => void;
};

const AuthDialogContext = createContext<AuthDialogContextValue | undefined>(undefined);

export const AuthDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AuthTab>("signin");

  const openDialog = (tab: AuthTab = "signin") => {
    setActiveTab(tab);
    setOpen(true);
  };

  const closeDialog = () => setOpen(false);

  const value = useMemo(
    () => ({
      openDialog,
      closeDialog,
    }),
    []
  );

  return (
    <AuthDialogContext.Provider value={value}>
      {children}
      <AuthDialog
        open={open}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenChange={(next) => {
          if (!next) {
            closeDialog();
          } else {
            setOpen(next);
          }
        }}
      />
    </AuthDialogContext.Provider>
  );
};

export const useAuthDialog = () => {
  const context = useContext(AuthDialogContext);
  if (!context) {
    throw new Error("useAuthDialog must be used within an AuthDialogProvider");
  }
  return context;
};
