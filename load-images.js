// prepare DOM Element References
const avatarContainer = document.getElementById('avatar-container');

function loadImages(url) {
  const xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // let imgBox = '';
      // let imgLists = JSON.parse(this.responseText);
      // imgLists.forEach(img => {
      //   imgBox += getHtmlImg(img);
      // });

      // avatarContainer.innerHTML = imgBox;
      console.log(this.responseText);
    }
  }

  xhttp.open('GET', url, true);
  xhttp.send();
}

function getHtmlImg(imgSrc) {
  $html = '<div class="grid-item border border-dark rounded">';
  $html += '<img src="' + imgSrc + '" alt="" class="avatar">';
  $html += '</div>';

  return $html;
}

function initModal() {
  loadImages('server/image.php?path=true');
}

initModal();