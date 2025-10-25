import { useState, forwardRef } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useField, useFormikContext } from "formik";

const ReusableInput = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      value,
      onChange,
      onBlur,
      iconLeft,
      iconRight,
      error,
      border,
      classes,
      backgroundColor = "bg-white",
      focusRing = "focus:ring-primary-600",
      readOnly,
      containerClasses = "",
      as,
      children,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [inputType, setInputType] = useState(type);

    // Try to get Formik context
    let formikField = {};
    let formikMeta = {};
    let isFormik = false;
    try {
      useFormikContext();
      [formikField, formikMeta] = useField(name || "");
      isFormik = !!name;
    } catch {
      isFormik = false;
    }

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
      setInputType(showPassword ? "password" : "text");
    };

    // Use the error from props if provided, otherwise use Formik's error
    const displayError = error || (formikMeta.touched && formikMeta.error);
    
    // Get current value to determine text color
    const fieldValue = isFormik ? formikField.value : value;
    const hasValue = fieldValue !== undefined && fieldValue !== null && fieldValue !== "";
    const textColor = hasValue ? "text-primary" : "text-[#6668769C]";

    const commonProps = {
      id: name,
      name: name,
      ref: ref,
      className: `w-full md:h-[3.18rem] h-[3.4rem] font-poppins placeholder-[#6668769C] text-[0.879rem] ${textColor} px-4 py-4 rounded-xl border ${error ? "border-red-500" : `${border || "border-gray-50"} `
        } ${backgroundColor} ${readOnly
          ? "outline-none"
          : `focus:outline-none focus:ring-1 ${focusRing}`
        } ${iconLeft ? "pl-10" : ""} ${iconRight || type === "password" ? "pr-10" : ""
        } ${classes}`,
      readOnly: readOnly,
      placeholder: placeholder,
      // Use Formik if available, else fallback to props
      ...(isFormik
        ? { ...formikField }
        : {
          value,
          onChange,
          onBlur,
        }),
      ...props,
    };

    // Input specific props that shouldn't be applied to other elements
    const inputSpecificProps = {
      type: type === "password" ? inputType : type,
    };

    return (
      <div className={containerClasses}>
        {label && (
          <label
            htmlFor={name}
            className="block text-xs font-normal text-primary mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {iconLeft}
            </div>
          )}

          {as === "select" ? (
            <select {...commonProps}>
              {children}
            </select>
          ) : as === "textarea" ? (
            <textarea {...commonProps} />
          ) : (
            <input
              {...commonProps}
              {...inputSpecificProps}
            />
          )}

          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <AiOutlineEye
                  size={27}
                  className="md:text-gray-light text-primary"
                />
              ) : (
                <AiOutlineEyeInvisible
                  size={27}
                  className="md:text-gray-light text-primary"
                />
              )}
            </button>
          )}
          {iconRight && type !== "password" && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900">
              {iconRight}
            </div>
          )}
        </div>
        {displayError && <p className="mt-1 text-xs text-red-500">{displayError}</p>}
      </div>
    );
  }
);

export default ReusableInput;