import { useEffect } from "react";

export function useOutsideClick(ref: any, onClickOut: () => void, deps = []) {
    useEffect(() => {
        const onClick = ({ target }: any) => !ref?.current?.contains(target) && onClickOut?.();
        const handleClick = () => document.addEventListener("click", onClick);

        handleClick();

        return () => {
            document.removeEventListener("click", onClick);
        };
    }, [ref, onClickOut, ...deps]);
}
