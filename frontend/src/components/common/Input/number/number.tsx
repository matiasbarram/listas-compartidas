import React, { useState } from "react"
import NumberButton from "./btn"

function InputNumber() {
    const [count, setCount] = useState(0)

    const handleIncrement = () => {
        setCount(count + 1)
    }

    const handleDecrement = () => {
        if (count > 0) {
            setCount(count - 1)
        }
    }

    return (
        <div className="w-32  rounded-lg p-1">
            <div className="flex flex-row h-10 w-full relative">
                <NumberButton onClick={handleDecrement} text="-" type="l" />
                <input
                    type="number"
                    className="focus:outline-none text-center w-full bg-transparent font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none"
                    name="custom-input-number"
                    value={count}
                    readOnly
                />
                <NumberButton onClick={handleIncrement} text="+" type="r" />
            </div>
        </div>
    )
}

export default InputNumber
