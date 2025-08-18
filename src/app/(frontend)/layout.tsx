import React from 'react'
import "./globals.css" 



export const metadata = {
  description: 'A Blog Application Build using NEXTJS and PAYLOAD CMS',
  title: 'TechBlog Pro',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
