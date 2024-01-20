import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CreateReviewModal from "./CreateReviewModal";
import { useState, useEffect, useRef } from "react";


export default function CreateReviewButton() {
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    // useEffect(() => {
    //     if (!showMenu) return;

    //     const closeMenu = (e) => {
    //         if (!ulRef.current.contains(e.target)) {
    //             setShowMenu(false);
    //         }
    //     };

    //     document.addEventListener('click', closeMenu);

    //     return () => document.removeEventListener('click', closeMenu);
    // }, [showMenu]);

    // const closeMenu = () => setShowMenu(false);

    return (
        <OpenModalButton
            buttonText="Post Your Review"
            // onItemClick={closeMenu}
            modalComponent={<CreateReviewModal />}
        />
    );
}
