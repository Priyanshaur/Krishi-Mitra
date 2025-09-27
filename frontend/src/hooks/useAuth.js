import { useSelector } from 'react-redux'

export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector(state => state.auth)
  
  return {
    user,
    isAuthenticated,
    loading,
    isFarmer: user?.role === 'farmer',
    isBuyer: user?.role === 'buyer',
    isAdmin: user?.role === 'admin'
  }
}