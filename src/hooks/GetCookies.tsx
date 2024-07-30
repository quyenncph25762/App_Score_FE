import React from 'react'
import Cookies from 'js-cookie'
const GetCookies = (cookieName: any) => {
    return Cookies.get(cookieName)
}

export default GetCookies
