import { useAuthContext } from '../context/AuthContext.jsx';

// Thin wrapper so pages can `import { useAuth }` rather than reach into context directly.
export const useAuth = () => useAuthContext();
