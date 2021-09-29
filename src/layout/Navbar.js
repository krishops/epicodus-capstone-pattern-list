import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth';



const Navbar = () => {

  const { user, logout } = useAuth()
  return (
    <div>
      {user && (
        <>
        <Link to='/'>
          Dashboard
        </Link>
        <button onClick={logout}>Logout</button>
        </>
      )}
      {!user && (
        <Link to='/login'>
        Login
      </Link>
      )}
    </div>
  );
}
 
export default Navbar;