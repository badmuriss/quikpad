import React from "react"

export const FontSizeIcon = React.memo(
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 6v15H8V6H2V4h14v2h-6zm8 8v7h-2v-7h-3v-2h8v2h-3z"
          fill="currentColor"
        />
      </svg>
    )
  }
)

FontSizeIcon.displayName = "FontSizeIcon"
