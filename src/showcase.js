import { LitElement, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import _ from 'lodash';
import $ from 'jquery';

import { renderFonts, ensureFonts } from './lib/typography.js';
import { renderKeyframes, ensureKeyframes } from './lib/keyframes.js';
import { scrollTo } from './lib/scroll.js';

import fonts__suedtirol_pro_woff from './fonts/SuedtirolPro-Regular.woff';
import fonts__suedtirol_next_woff from './fonts/SuedtirolNextTT.woff';
import fonts__suedtirol_next_woff2 from './fonts/SuedtirolNextTT.woff2';
import fonts__suedtirol_next_bold_woff from './fonts/SuedtirolNextTT-Bold.woff';
import fonts__suedtirol_next_bold_woff2 from './fonts/SuedtirolNextTT-Bold.woff2';
import fonts__kievit_regular_woff from './fonts/Kievit.woff';
import fonts__kievit_bold_woff from './fonts/Kievit-Bold.woff';

import styles__normalize from 'normalize.css/normalize.css';
import styles from './showcase.scss';

import assets__scroll_hint_icon from './images/arrow-down.svg';

const fonts = [
  {
    name: 'pages-suedtirol',
    woff: fonts__suedtirol_pro_woff,
    weight: 400
  },
  {
    name: 'pages-suedtirol-next',
    woff: fonts__suedtirol_next_woff,
    woff2: fonts__suedtirol_next_woff2,
    weight: 400
  },
  {
    name: 'pages-suedtirol-next',
    woff: fonts__suedtirol_next_bold_woff,
    woff2: fonts__suedtirol_next_bold_woff2,
    weight: 700
  },
  {
    name: 'pages-kievit',
    woff: fonts__kievit_regular_woff,
    weight: 400
  },
  {
    name: 'pages-kievit',
    woff: fonts__kievit_bold_woff,
    weight: 700
  }
];

const keyframes = [
  {
    name: 'pages-bounce',
    steps: [
      {
        at: [0, 20, 50, 80, 100],
        rules: {
          'transform': 'translateY(0)'
        }
      },
      {
        at: 40,
        rules: {
          'transform': 'translateY(-32px)'
        }
      },
      {
        at: 60,
        rules: {
          'transform': 'translateY(-16px)'
        }
      }
    ]
  }
];

class ShowcaseElement extends LitElement {

  constructor() {
    super();

    this.srcUrl = '';
    this.textAlignment = 'left';
    this.scrollhintEnabled = 'true';
    this.scrollhintAnimationEnabled = 'true';
    this.scrollhintStep = '100%';
  }

  static get properties() {
    return {
      srcUrl: { attribute: 'src', type: String },
      textAlignment: { attribute: 'align', type: String },
      scrollhintEnabled: { attribute: 'scroll-hint', type: String },
      scrollhintAnimationEnabled: { attribute: 'scroll-hint-animated', type: String },
      scrollhintStep: { attribute: 'scroll-by', type: String },
    };
  }

  render() {
    return html`
      <style>
        ${renderFonts(fonts)}
        ${renderKeyframes(keyframes)}
        ${styles__normalize}
        ${styles}
      </style>
      <div id="container">
        <div id="backdrop"></div>
        <div id="mask"></div>
        <div id="copyright">
          <span id="copyright-text"></span>
        </div>
        <div id="texts" class="${!!this.textAlignment ? 'is-' + this.textAlignment + '-aligned' : ''}">
          <div id="title"></div>
          <div id="subtitle"></div>
        </div>
        <div id="scroll-hint" class="${!!this.scrollhintEnabled && this.scrollhintEnabled === 'true' ? 'is-enabled' : ''} ${!!this.scrollhintAnimationEnabled && this.scrollhintAnimationEnabled === 'true' ? 'is-animated' : ''}">
          ${unsafeHTML(assets__scroll_hint_icon)}
        </div>
      </div>
    `;
  }

  async firstUpdated() {
    let self = this;
    let root = self.shadowRoot;

    ensureFonts(fonts);
    ensureKeyframes(keyframes);

    let backdrop = root.getElementById('backdrop');
    let copyright = root.getElementById('copyright');
    let copyrightText = root.getElementById('copyright-text');
    let title = root.getElementById('title');
    let subtitle = root.getElementById('subtitle');

    let scrollHint = root.getElementById('scroll-hint');
    scrollHint.addEventListener('click', (e) => {
      scrollTo(root.getElementById('container'), self.scrollhintStep);
    })

    if (!!self.srcUrl) {
      fetch(self.srcUrl).then((response) => {
        return response.json();
      }).then((data) => {
        backdrop.style.backgroundImage = 'url(' + data.image.src + ')';

        if (!!data.image.copyright) {
          copyright.classList.add('is-defined');
          copyrightText.innerHTML = '&copy; ' + data.image.copyright;
        }

        title.textContent = data.title;
        subtitle.textContent = data.subtitle;
      });
    }

    let container = root.getElementById('container');
    let mask = root.getElementById('mask');

    $(window).on('scroll', () => {
      var offset = $(document).scrollTop();
      var top = $(container).offset().top;
      var height = $(container).height();

      if ((offset > (top + height)) || (offset > top && offset <= (top + height) && ((offset - top) / height) >= 0.2)) {
        $(mask).css('opacity', '1');
      } else {
        $(mask).css('opacity', '0');
      }
    });
  }

}

if (!customElements.get('pages-showcase')) {
  customElements.define('pages-showcase', ShowcaseElement);
}