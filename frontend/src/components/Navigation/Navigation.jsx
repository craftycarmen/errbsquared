import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <>
            <NavLink to="/" style={{ fontWeight: "bold" }}>WanderlyHomes</NavLink >

            {isLoaded && (

                <div><ProfileButton user={sessionUser} /></div>

            )
            }
        </>
    );
}

export default Navigation;
