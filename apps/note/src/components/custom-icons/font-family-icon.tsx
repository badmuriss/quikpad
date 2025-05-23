import React from "react"

export const FontFamilyIcon = React.memo(
  ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        width="24"
        height="24"
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M13 6v15h-2V6H5V4h14v2z"
          fill="currentColor"
        />
        
      </svg>
    )
  }
)

FontFamilyIcon.displayName = "FontFamilyIcon"