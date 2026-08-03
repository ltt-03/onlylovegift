import os
path = '/Users/lethanhtunggmail.com/onlylovegift/server/templates/gift-surprise-v2/index.html'
with open(path, 'r') as f:
    content = f.read()

idx = content.find('<div class="gallery-gif-wrapper bottom">')
if idx != -1:
    good_content = content[:idx]
    good_content += '''<div class="gallery-gif-wrapper bottom">
        <div class="flying-text text-left">
          FOR YOU
        </div>
        <img src="./style/external/gallery-bottom.gif" alt="Decoration" class="gallery-gif" />
      </div>
    </div>
  </div>

  <div class="overlay" id="lightbox-overlay" style="z-index: 2000">
    <div class="lightbox-content">
      <button class="close-btn" id="close-lightbox"><i class="fa-solid fa-xmark"></i></button>
      <img src="" alt="Full View" id="lightbox-img" />
    </div>
  </div>

  <div class="overlay" id="gift-overlay">
    <div class="gift-modal" id="gift-modal-element">
      <button class="close-btn" id="close-gift"><i class="fa-solid fa-xmark"></i></button>
      <button class="fullscreen-btn" id="fullscreen-gift"><i class="fa-solid fa-expand"></i></button>
      <iframe src="./style/gift/gift.html" frameborder="0" class="gift-iframe"></iframe>
    </div>
  </div>

  <audio id="audio-player"></audio>
  <audio id="pop-sound" src="./style/pop.mp3"></audio>

  <script src="./style/script.js"></script>
</body>
</html>
'''
    with open(path, 'w') as f:
        f.write(good_content)
    print('Fixed!')
else:
    print('Could not find string')
