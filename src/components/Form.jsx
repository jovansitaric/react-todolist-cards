import React, { useMemo, useState } from "react"
import { errorMessages } from "../utils/constants"

export default function Form() {
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        message: "",
    })

    const [errorData, setErrorData] = useState({
        name: "",
        surname: "",
        message: "",
    })

    const [isFormSubmited, setIsFormSubmited] = useState(false)

    const handleFormSubmit = (e) => {
        setIsFormSubmited(true)
        e.preventDefault()
        localStorage.setItem("formData", JSON.stringify(formData))
    }

    const formChange = (e) => {
        const { name, value } = e.target

        if (isFormSubmited) setIsFormSubmited(false)

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const formValidate = (e, type) => {
        const { name, value } = e.target

        setErrorData((prevState) => ({
            ...prevState,
            [name]:
                type.includes('required') && !value
                    ? errorMessages.required
                    : "",
        }))
    }

    const isDisabledButton = useMemo(
        () => Object.values(formData).some((value) => !value),
        [JSON.stringify(formData)]
    )

    const hasSubmitedForm = useMemo(
        () => Object.values(formData).some((value) => !value) && isFormSubmited,
        [JSON.stringify(formData)]
    )

    return (
        <form className="App" onSubmit={handleFormSubmit}>
            {["name", "surname", "message"].map((field) => (
                <div className="form-control" key={field}>
                    <label htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                        type="text"
                        placeholder={`e.g. ${field}`}
                        name={field}
                        onInput={(event) => formValidate(event, ["required"])}
                        onChange={formChange}
                    />
                    <span className={`error ${errorData[field] ? "show" : ""}`}>
                        {errorData[field]}
                    </span>
                </div>
            ))}
            <span className={`error ${hasSubmitedForm ? "show" : ""}`}>
                {errorMessages.generic}
            </span>
            <button type="submit" disabled={isDisabledButton}>
                Submit
            </button>
        </form>
    )
}