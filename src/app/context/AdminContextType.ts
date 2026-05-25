export type AdminContextType = {
  isAdminLoggedIn: boolean;
  setAdminLoggedIn: (value: boolean) => void;
  adminLogout: () => void;
};
