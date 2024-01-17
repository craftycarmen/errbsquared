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
                <section className='profile'>
                    {sessionUser &&
                        <span className='createSpot'>Create a New Spot</span>
                    }
                    <ProfileButton user={sessionUser} />
                </section>

            )
            }
        </div>
    );
}

export default Navigation;
