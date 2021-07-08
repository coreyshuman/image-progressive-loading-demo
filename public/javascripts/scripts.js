(function () {
  const blurCheckbox = document.getElementById('blurCheckbox');
  document.addEventListener('keypress', (e) => {
    if (e.key.toUpperCase() === 'B') {
      const enabled = blurCheckbox.checked;
      blurCheckbox.checked = !enabled;
      blurClick();
    }
  });

  if (blurCheckbox) {
    blurCheckbox.addEventListener('change', (e) => {
      blurClick();
    })
  }

  function blurClick() {
    const enabled = blurCheckbox.checked;

    const images = document.getElementsByClassName('image');
    for (image of images) {
      enabled ? image.classList.add('blur') : image.classList.remove('blur');
    }
  }

  const images = document.getElementsByClassName('image');
  console.log(images)
  for (image of images) {
    image.addEventListener('load', (e) => {
      console.log(e)
      e.path[1].classList.remove('loading');
    })
  }
})();