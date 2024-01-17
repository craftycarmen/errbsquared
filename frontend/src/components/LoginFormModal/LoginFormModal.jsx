import { useEffect, useState } from "react"
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';
import { Link } from "react-router-dom";

export default function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [charCount, setCharCount] = useState({});
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    useEffect(() => {
        const char = {}
        if (credential.length < 4) char.credential = 'Not enough characters'
        if (password.length < 6) char.password = 'Not enough characters'
        setCharCount(char)
    }, [credential, password])

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        return dispatch(
            sessionActions.login({
                credential,
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
    };

    const demoUser = () => {
        return dispatch(
            sessionActions.login({
                credential: "Demo-lition",
                password: "password"
            })
        )
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();

                if (data?.errors) {
                    setErrors(data.errors);
                }
            });
    };

    return (
        <section className="login">
            <h1>Log In</h1>
            <p className="error">
                {errors.credential && `${errors.credential}`}
            </p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            placeholder="Username or Email"
                            type="text"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <label>
                    <input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <div>
                    <button
                        disabled={Object.values(charCount).length}
                        type="submit">Log In</button>
                </div>
                <div>
                    <button onClick={demoUser}>Log In as Demo User</button>
                </div>
            </form>

        </section >
    );
}
