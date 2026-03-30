// import React from 'react';
// import PropTypes from 'prop-types';

// const Input = React.forwardRef(({ className, ...props }, ref) => (
//   <input ref={ref} className={`block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${className}`} {...props} />
// ));

// Input.displayName = 'Input';
// Input.propTypes = {
//   className: PropTypes.string,
// };

// export { Input };

import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border bg-zinc-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }

