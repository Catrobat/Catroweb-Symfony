/* eslint-env jquery */
/* global CookieHelper */

(function LoginTokenHandler () {
  document.getElementById('loginform form_fos').addEventListener('submit', function (event) {
    event.preventDefault()
    const data = JSON.stringify({
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    })

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/authentication', true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          CookieHelper.setCookie('LOGGED_IN', 'true', 'Tue, 19 Jan 2038 00:00:01 GMT')
          window.location.href = '/'
        } else {
          document.getElementById('login-alert').style.display = 'block'
        }
      }
    })

    xhr.send(data)
  })
})()
