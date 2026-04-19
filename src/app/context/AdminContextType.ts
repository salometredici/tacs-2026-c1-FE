export type AdminContextType = {
  isAdminLoggedIn: boolean;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
};
