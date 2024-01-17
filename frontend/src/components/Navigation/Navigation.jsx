import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <div className='nav'>
            <NavLink to="/"><h1>wanderly.</h1></NavLink >

            {isLoaded && (

                <div><ProfileButton user={sessionUser} /></div>

            )
            }
        </div>
    );
}

export default Navigation;
