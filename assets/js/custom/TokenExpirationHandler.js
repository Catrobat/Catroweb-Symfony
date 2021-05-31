/* eslint-env jquery */
/* global CookieHelper, jwt_decode */

(function TokenExpirationHandler () {
  let interval = null

  function init () {
    checkBearerTokenExpiration()
    interval = setInterval(checkBearerTokenExpiration, 1000)
  }

  function checkBearerTokenExpiration () {
    const bearerToken = CookieHelper.getCookie('BEARER')
    if (bearerToken && jwt_decode) {
      const decodedToken = jwt_decode(bearerToken)
      if (decodedToken && decodedToken.exp) {
        const now = Date.now().valueOf() / 1000
        if (decodedToken.exp < now || decodedToken.exp < (now + 60)) {
          refreshToken()
        }
      }
    } else if (CookieHelper.getCookie('LOGGED_IN')) {
      refreshToken()
    }
  }

  function refreshToken () {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/authentication/refresh', true)
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === this.DONE) {
        if (this.status !== 200) {
          CookieHelper.deleteCookie('BEARER')
          clearInterval(interval)
        }
      }
    })

    xhr.send()
  }

  init()
})()
