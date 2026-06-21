import { useEffect } from "react"

export function useOutsideClick(ref: any, onClickOut: () => void, deps: unknown[] = []) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const onClick = ({ target }: any) =>
            !ref?.current?.contains(target) && onClickOut?.()
        const handleClick = () => document.addEventListener("click", onClick)
        handleClick()

        return () => {
            document.removeEventListener("click", onClick)
        }
    }, [ref, onClickOut, ...deps])
}
