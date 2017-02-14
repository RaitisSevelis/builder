(function (window, document) {
  function createSlider(element) {
    var Slider = {
      slider: null,
      slides: [],
      activeSlide: 0,
      isRtl: false,
      timeout: 1000,
      interval: null,

      init: function init(element) {
        // check for data
        if (!element.getVceSlider) {
          element.getVceSlider = this;
        }
        this.slider = element;
        this.handleAnimationEnd = this.handleAnimationEnd.bind(this);

        this.refresh();
        return element.getVceSlider;
      },
      handleAnimationEnd: function handleAnimationEnd(event) {
        event.target.classList.remove('vce-asset-background-slider-item--animate');
        event.target.style.left = null;
        if (event.target.dataset.vceAssetsSliderStayHidden === 'true') {
          event.target.style.visibility = 'hidden';
        } else {
          event.target.style.visibility = 'visible';
        }
      },
      refresh: function refresh() {
        var _this = this;

        this.isRtl = window.getComputedStyle(this.slider).direction === 'rtl';
        this.timeout = parseInt(this.slider.dataset.vceAssetsSlider) * 1000;
        // set slides
        this.slides = this.slider.querySelectorAll(this.slider.dataset.vceAssetsSliderSlide);
        this.slides = [].slice.call(this.slides); // to create array from slides list
        this.slides.forEach(function (slide) {
          slide.removeEventListener('animationend', _this.handleAnimationEnd);
          slide.addEventListener('animationend', _this.handleAnimationEnd);
        });
        // this.slideTo(0);
        this.autoplay();
      },
      destroy: function destroy() {
        this.stopAutoplay();
        this.slides.forEach(function (slide) {
          slide.style.transform = null;
        });
        delete this.slider.getVceSlider;
      },
      slideTo: function slideTo(index) {
        if (index >= 0 && index < this.slides.length) {
          var prevIndex = this.activeSlide;
          this.activeSlide = index;
          this.slides[prevIndex].style.left = '0';
          this.slides[prevIndex].style.visibility = 'visible';
          this.slides[prevIndex].dataset.vceAssetsSliderStayHidden = true;
          this.slides[index].style.left = '100%';
          this.slides[index].dataset.vceAssetsSliderStayHidden = false;
          this.slides[index].style.visibility = 'visible';
          this.slides[prevIndex].classList.add('vce-asset-background-slider-item--animate');
          this.slides[index].classList.add('vce-asset-background-slider-item--animate');
        }
      },
      slideToNext: function slideToNext() {
        if (this.slides.length > 1) {
          if (this.activeSlide === this.slides.length - 1) {
            this.slideTo(0);
          } else {
            this.slideTo(this.activeSlide + 1);
          }
        }
      },
      slideToPrev: function slideToPrev() {
        if (this.slides.length > 1) {
          if (this.activeSlide === 0) {
            this.slideTo(this.slides.length - 1);
          } else {
            this.slideTo(this.activeSlide - 1);
          }
        }
      },
      autoplay: function autoplay() {
        var _this2 = this;

        this.stopAutoplay();
        if (this.isRtl) {
          this.interval = window.setInterval(function () {
            _this2.slideToPrev();
          }, this.timeout);
        } else {
          this.interval = window.setInterval(function () {
            _this2.slideToNext();
          }, this.timeout);
        }
      },
      stopAutoplay: function stopAutoplay() {
        window.clearInterval(this.interval);
      }
    };
    return Slider.init(element);
  }

  var sliders = {
    init: function init(selector) {
      var sliders = document.querySelectorAll(selector);
      sliders = [].slice.call(sliders);
      sliders.forEach(function (slider) {
        if (slider.getVceSlider) {
          slider.getVceSlider.refresh();
        } else {
          createSlider(slider);
        }
      });
      if (sliders.length === 1) {
        return sliders.pop();
      }
      return sliders;
    }
  };

  window.vceAssetsBackgroundSlider = sliders.init;
})(window, document);