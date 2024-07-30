import React from 'react'
import Cookies from 'js-cookie'
const RemoveCookies = (cookieName: any) => {
    return Cookies.remove(cookieName)
}

export default RemoveCookies
