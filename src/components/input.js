import React from 'react'

const renderInputField = (name, value, type, fun, autocomplete) => {
  const lowerCaseName = name.toLowerCase()
  return (
    <div className="input-row">
      <label htmlFor={lowerCaseName} className="input-row-column">
        {name}
      </label>
      <input
        className="input-row-column"
        placeholder={name}
        value={value}
        onChange={fun}
        type={type}
        id={lowerCaseName}
        name={lowerCaseName}
        autoComplete={autocomplete}
      />
    </div>
  )
}

export { renderInputField }