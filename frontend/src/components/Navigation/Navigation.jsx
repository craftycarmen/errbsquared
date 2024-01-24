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
                    {sessionUser && (
                        <div className='createSpotContainer'>
                            <div className='createSpot'>
                                <Link to='/spots/new'>Create a New Spot</Link>
                            </div>
                        </div>
                    )}
                    <div className='profileButton'>
                        <ProfileButton user={sessionUser} />
                    </div>
                </section>

            )
            }
        </div>
    );
}

export default Navigation;
