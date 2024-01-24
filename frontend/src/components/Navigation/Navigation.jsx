import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <div className='nav'>
            <NavLink to="/"><img src='../../wanderly.png' /></NavLink>

            {isLoaded && (
                <section className='profile'>
                    {sessionUser &&
                        <Link to='/spots/new'><span className='createSpot'>Create a New Spot</span></Link>
                    }
                    <ProfileButton user={sessionUser} />
                </section>

            )
            }
        </div>
    );
}

export default Navigation;
