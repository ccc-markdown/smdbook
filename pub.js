var converter = new window.showdown.Converter()
converter.setFlavor('github')

function absolute (base, relative) {
  var stack = base.split('/')
  var parts = relative.split('/')
  stack.pop() // remove current file name (or empty string)
              // (omit if 'base' is the current folder without trailing slash)
  for (var i = 0; i < parts.length; i++) {
    if (parts[i] === '.') continue
    if (parts[i] === '..') {
      stack.pop()
    } else {
      stack.push(parts[i])
    }
  }
  return stack.join('/')
}

function mdRender (element, mdText) {
  element.innerHTML = converter.makeHtml(mdText)
  element.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', function (event) {
      event.preventDefault()
      let href = a.getAttribute('href')
      if (href.indexOf('://') < 0) {
        window.location.hash = '#' + absolute(window.location.hash.substring(1), href)
      } else {
        window.location.href = a.href
      }
    })
  })
  MathJax.Hub.Queue(['Typeset', MathJax.Hub, element])
}

function fetchRender(path, element) {
  let req = new window.Request(path, {method: 'GET', cache: 'reload'})
  window.fetch(req).then(function (response) {
    return response.text().then(function (mdText) {
      mdRender(element, mdText)
    })
  }).catch(function (err) {
    console.log(path + ' load error ! ' + err.message)
  })
}

function show () {
  var file = window.location.hash.substring(1)
  var path = file.match(/^(.*\/).*$/)[1]
//  var sideFile = path + 'sidebar.md'
  fetchRender('./' + file, mdMain)
  fetchRender('./' + path + 'sidebar.md', mdSide)
  fetchRender('./' + path + 'footer.md', mdFoot)
}

var mdSide, mdMain, mdFoot

function load () {
  mdSide = document.getElementById('mdSide')
  mdFoot = document.getElementById('mdFoot')
  mdMain = document.getElementById('mdMain')
  show()
}

window.addEventListener('hashchange', show)
window.addEventListener('load', load)

// ------------------- side menu ---------------------
function openNav () {
  document.getElementById('sidemenu').style.width = '250px'
}

function closeNav () {
  document.getElementById('sidemenu').style.width = '0'
}
