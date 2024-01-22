import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css'

export default function SignupFormModal() {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    useEffect(() => {
        const errs = {};
        if (!email) errs.email = '';
        if (!username || username.length < 4) errs.username = '';
        if (!firstName) errs.firstName = '';
        if (!lastName) errs.lastName = '';
        if (!password) errs.password = '';
        if (!confirmPassword) errs.confirmPassword = '';
        if (password && password.length < 6) errs.password = 'Password must be 6 characters or more'
        if (confirmPassword && password !== confirmPassword) errs.confirmPassword = 'Password and confirm password must match';

        setErrors(errs);
    }, [email, username, firstName, lastName, password, confirmPassword])

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === confirmPassword) {
            setErrors({});

            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();

                    if (data?.errors) {
                        setErrors(data.errors);
                    }
                });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };

    return (
        <div className="signup">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email*"
                    // required
                    />
                    <div className="error">{errors.email && `${errors.email}`}</div>
                </div>
                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        // required
                        placeholder="Username (minimum 4 characters)*"
                    />
                    <div className="error">{errors.username && `${errors.username}`}</div>
                </div>
                <div>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        // required
                        placeholder="First Name*"
                    />
                    <div className="error">{errors.firstName && `${errors.firstName}`}</div>
                </div>
                <div>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        // required
                        placeholder="Last Name*"
                    />
                    <div className="error">{errors.lastName && `${errors.lastName}`}</div>
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        // required
                        placeholder="Password (minimum 6 characters)*"
                    />
                    <div className="error">{errors.password && `${errors.password}`}</div>
                </div>
                <div>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        // required
                        placeholder="Confirm Password*"
                    />
                    <div className="error">{errors.confirmPassword && `${errors.confirmPassword}`}</div>
                </div>
                <div>
                    <button
                        disabled={Object.values(errors).length}
                        type="submit">Sign Up</button>
                </div>
            </form>
        </div>
    )
}
