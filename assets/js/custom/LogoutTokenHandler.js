/* eslint-env jquery */
/* global CookieHelper */

(function LogoutTokenHandler () {
  const logoutButton = document.getElementById('btn-logout')
  logoutButton.onclick = function () {
    const xhr = new XMLHttpRequest()
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === this.DONE) {
        CookieHelper.deleteCookie('BEARER')
        CookieHelper.deleteCookie('LOGGED_IN')
        if (logoutButton.dataset && logoutButton.dataset.logoutPath) {
          window.location.href = logoutButton.dataset.logoutPath
        }
      }
    })

    xhr.open('DELETE', '/api/authentication')
    xhr.setRequestHeader('X-Refresh', 'token')
    xhr.send()
  }

  function init () {
    if (CookieHelper.getCookie('BEARER')) {
      document.getElementById('logout-nav-item').style.display = 'block'
    }
  }

  init()
})()
