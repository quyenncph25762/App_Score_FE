import React from 'react'
import Cookies from 'js-cookie'
const SetCookies = (cookieName: any, usrin) => {
    Cookies.set(cookieName, usrin, {
        secure: true,
        sameSite: 'strict'
    })
}

export default SetCookies
