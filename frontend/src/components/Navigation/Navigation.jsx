import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import ProfileButton from "./ProfileButton";
import { NavLink } from "react-router-dom";

export default function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    const sessionLinks = sessionUser ? (
        <>
            <li>
                <ProfileButton user={sessionUser} />
            </li>
            <li>
                <button onClick={logout}>Log Out</button>
            </li>
        </>
    ) : (
        <>
            <li>
                <NavLink to="/login">Log In</NavLink>
            </li>
            <li>
                <NavLink to="/signup">Sign Up</NavLink>
            </li>
        </>
    )
    return (
        <ul>
            <li>
                <NavLink to="/">Home</NavLink>
            </li>
            {isLoaded && sessionLinks}
        </ul>
    )
}
