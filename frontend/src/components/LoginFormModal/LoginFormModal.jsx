import { useEffect, useState } from "react"
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';

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
        // .catch(async (res) => {
        //     const data = await res.json();

        //     if (data?.errors) {
        //         setErrors(data.errors);
        //     }
        // });
    };

    return (
        <section className="modal">
            <h1>Log In</h1>
            <p className="error">
                {errors.credential && `${errors.credential}`}
            </p>
            <form onSubmit={handleSubmit}>
                <div className="inputContainer">
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        placeholder=""
                        id="credential"
                    />
                    <label htmlFor="credential" className="floating-label">Username or Email
                    </label>
                </div>
                <div className="inputContainer">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder=""
                        id="password"
                    />
                    <label htmlFor="password" className="floating-label">Password
                    </label>
                </div>
                <div>
                    <button
                        disabled={Object.values(charCount).length}
                        type="submit">Log In</button>
                </div>
                <button onClick={demoUser}>Log In as Demo User</button>
            </form>

        </section >
    );
}
