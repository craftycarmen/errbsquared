import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <div className='nav'>
            <NavLink to="/"><h1>wanderly.</h1></NavLink >

            {isLoaded && (
                <section className='profile'>
                    {sessionUser &&
                        <span className='createSpot'><Link to='/spots/new'>Create a New Spot</Link></span>
                    }
                    <ProfileButton user={sessionUser} />
                </section>

            )
            }
        </div>
    );
}

export default Navigation;
