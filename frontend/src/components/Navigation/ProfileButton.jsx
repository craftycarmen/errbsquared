import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Link } from 'react-router-dom';
import './Navigation.css';

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <div className='menu'>
                <div className='menuIcon' onClick={toggleMenu}>
                    <i className="fa-solid fa-bars fa-lg" /> <i className="fa-solid fa-user fa-lg" />
                </div>
            </div>

            <div>
                {user ? (
                    <div className={ulClassName} ref={ulRef}>
                        <div>Hello, {user.firstName}!</div>
                        <div>{user.email}</div>
                        <hr />
                        <div><Link to='/spots/current'>Manage Spots</Link></div>
                        <hr />
                        <div>
                            <Link to='/'><button onClick={logout}>Log Out</button></Link>
                        </div>
                    </div>
                ) : (
                    <div className={ulClassName} ref={ulRef}>
                        <OpenModalMenuItem
                            itemText="Sign Up"
                            onItemClick={closeMenu}
                            modalComponent={<SignupFormModal />}
                        />
                        <OpenModalMenuItem
                            itemText="Log In"
                            onItemClick={closeMenu}
                            modalComponent={<LoginFormModal />}
                        />
                    </div>
                )}
            </div >

        </>
    );
}

export default ProfileButton;
