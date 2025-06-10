import React, { useRef } from "react";

const Dialog = (props) => {
    const dialog = useRef()

    const saveHandler = () => {
        props.clearProgression()
        closeHandler();
    }

    const openHandler = () => {
        dialog.current.showModal()
    }

    const closeHandler = () => {
        dialog.current.close()
    }

    return (
        <>
            <dialog ref={dialog}>
                <p>Are you sure to delete all your actual progression ?
                It's necessary if you want to start over the game or try a new record </p>
                <button onClick={saveHandler} type={"button"}>
                    Save
                </button>
                <button onClick={closeHandler} type="button">
                    Close
                </button>
            </dialog>
            <button type="button" onClick={openHandler}>
                Reset your progression
            </button>
        </>
    )
}

export default Dialog;