import React, {useEffect, useImperativeHandle, useRef} from "react";
import ReactDOM from "react-dom";

const Dialog2 = React.forwardRef(({ resetTimer, clearProgression, restartTimer, children }, ref) => {

    const dialogRef = useRef(null);


    useImperativeHandle(ref, () => ({
        openDialog: openHandler,
        closeDialog: closeHandler,
        setStatusTimerOnForm : setStatusTimerOnForm
    }));

    useEffect(() => {
        const observer = new MutationObserver(() => {
            if (dialogRef.current && !document.body.contains(dialogRef.current)) {
                dialogRef.current.close();
                document.getElementById("root").appendChild(dialogRef.current);
                dialogRef.current.showModal();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);



    const openHandler = () => {
        if (dialogRef.current?.showModal) {
            dialogRef.current.showModal();  // Opens the dialog as a modal
        } else {
            console.error("The <dialog> element is not supported in this browser.");
        }
    };

    const closeHandler = () => {
        if (dialogRef.current) {
            dialogRef.current.close();  // Closes the dialog
        }
    };

    const setStatusTimerOnForm = (status) => {
        if (status) {
            resetTimer();
            clearProgression();
        } else {
            restartTimer();
        }
        dialogRef.current.close();
    };

    return ReactDOM.createPortal(

            <dialog ref={dialogRef}>
                {children}
             </dialog>,
        document.getElementById("root")
    );
});

export default Dialog2;
