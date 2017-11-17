import { addStorage, getStorage, getService, env } from 'vc-cake'
import lodash from 'lodash'
import $ from 'jquery'
import SaveController from './lib/saveController'

addStorage('wordpressData', (storage) => {
  const controller = new SaveController()
  const modernAssetsStorage = getService('modernAssetsStorage')
  const elementsStorage = getStorage('elements')
  const workspaceStorage = getStorage('workspace')
  const settingsStorage = getStorage('settings')
  const documentManager = getService('document')
  const cook = getService('cook')
  const utils = getService('utils')
  storage.on('start', () => {
    // Here we call data load
    if (storage.state('status').get() === 'init' && !isClassicEditor()) {
      controller.load({}, storage.state('status'))
    }
  })
  storage.on('save', (options, source = '', callback) => {
    storage.state('status').set({ status: 'saving' }, source)
    settingsStorage.state('status').set({ status: 'ready' })
    const documentData = documentManager.all()
    storage.trigger('wordpress:beforeSave', {
      pageElements: documentData
    })
    options = lodash.defaultsDeep({}, {
      elements: documentData
    }, options)
    controller.save(options, storage.state('status'), callback)
  })
  const wrapExistingContent = (content) => {
    let textElement = cook.get({ tag: 'textBlock', output: utils.wpAutoP(content) })
    if (textElement) {
      elementsStorage.trigger('add', textElement.toJS())
    }
  }
  storage.state('saveReady').set(false)
  storage.state('status').set('init')
  storage.state('status').onChange((data) => {
    const { status, request } = data
    if (status === 'loadSuccess') {
      // setData('app:dataLoaded', true) // all call of updating data should goes through data state :)
      const globalAssetsStorage = modernAssetsStorage.getGlobalInstance()
      const customCssState = settingsStorage.state('customCss')
      const globalCssState = settingsStorage.state('globalCss')
      const localJsState = settingsStorage.state('localJs')
      const globalJsState = settingsStorage.state('globalJs')
      /**
       * @typedef {Object} responseData parsed data from JSON
       * @property {Array} globalElements list of global elements
       * @property {string} data saved data
       */
      let responseData = JSON.parse(request || '{}')
      if (responseData.globalElements && responseData.globalElements.length) {
        let globalElements = JSON.parse(responseData.globalElements || '{}')
        globalElements && globalAssetsStorage.setElements(globalElements)
      }
      const initialContent = document.getElementById('content').value
      if (!responseData.data && initialContent && initialContent.length) {
        elementsStorage.trigger('reset', {})
        wrapExistingContent(initialContent)
      } else if (responseData.data) {
        let data = JSON.parse(responseData.data ? decodeURIComponent(responseData.data) : '{}')
        elementsStorage.trigger('reset', data.elements || {})
      } else {
        elementsStorage.trigger('reset', {})
      }
      if (responseData.cssSettings && responseData.cssSettings.hasOwnProperty('custom')) {
        customCssState.set(responseData.cssSettings.custom || '')
      }
      if (responseData.cssSettings && responseData.cssSettings.hasOwnProperty('global')) {
        globalCssState.set(responseData.cssSettings.global || '')
      }
      if (env('CUSTOM_JS')) {
        if (responseData.jsSettings && responseData.jsSettings.hasOwnProperty('local')) {
          localJsState.set(responseData.jsSettings.local || '')
        }
        if (responseData.jsSettings && responseData.jsSettings.hasOwnProperty('global')) {
          globalJsState.set(responseData.jsSettings.global || '')
        }
      }
      // if (responseData.myTemplates) {
      //   let templates = JSON.parse(responseData.myTemplates || '{}')
      //   setData('myTemplates', templates)
      // }
      storage.state('status').set({ status: 'loaded' })
      workspaceStorage.state('app').set('started')
      settingsStorage.state('status').set({ status: 'ready' })
      window.onbeforeunload = () => {
        const settingsStorageStateGet = settingsStorage.state('status').get()
        const isCssChanged = settingsStorageStateGet &&
          settingsStorageStateGet.status &&
          settingsStorageStateGet.status === 'changed'
        if (isCssChanged) {
          return 'Changes that you made may not be saved.'
        }
      }
    } else if (status === 'loadFailed') {
      storage.state('status').set({ status: 'loaded' })
      throw new Error('Failed to load loaded')
    }
  })
  storage.on('rebuild', (postId) => {
    postId && controller.load({}, storage.state('rebuildStatus'), postId)
  })
  storage.state('rebuildStatus').set({ status: false })
  storage.state('rebuildstatus').onChange((data) => {
    const { status, request } = data
    if (status === 'loadSuccess') {
      const globalAssetsStorage = modernAssetsStorage.getGlobalInstance()
      /**
       * @typedef {Object} responseData parsed data from JSON
       * @property {Array} globalElements list of global elements
       * @property {string} data saved data
       */
      let responseData = JSON.parse(request || '{}')
      if (responseData.globalElements && responseData.globalElements.length) {
        let globalElements = JSON.parse(responseData.globalElements || '{}')
        globalElements && globalAssetsStorage.setElements(globalElements)
      }
      if (responseData.data) {
        let data = JSON.parse(responseData.data ? decodeURIComponent(responseData.data) : '{}')
        elementsStorage.trigger('reset', data.elements || {})
        // on finish render need to update storage.trigger('save')
      }
    }
  })

  let { jQuery, wp } = window
  let $post = jQuery('form#post')
  let $submitpost = $('#submitpost')
  let submitter = null
  let $submitters = $post.find('input[type=submit]')
  let previewVal = ''
  $submitters.click(function (event) {
    submitter = this
  })
  // Wordpress 4.7.5 duplicate function
  // Submit the form saving a draft or an autosave, and show a preview in a new tab
  const previewPage = (btn) => {
    let $this = btn
    let $form = $('form#post')
    let $previewField = $('input#wp-preview')
    let target = $this.attr('target') || 'wp-preview'
    let ua = navigator.userAgent.toLowerCase()

    if ($this.hasClass('disabled')) {
      return
    }

    if (wp.autosave) {
      wp.autosave.server.tempBlockSave()
    }

    $previewField.val('dopreview')

    $form.attr('target', target).submit().attr('target', '')

    // Workaround for WebKit bug preventing a form submitting twice to the same action.
    // https://bugs.webkit.org/show_bug.cgi?id=28633
    if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) {
      $form.attr('action', function (index, value) {
        return value + '?t=' + (new Date()).getTime()
      })
    }

    $previewField.val('')
  }
  let dataSaved = false
  $post.submit((e) => {
    if (!isClassicEditor()) {
      previewVal = $('input#wp-preview').val()
      if (previewVal === 'dopreview') {
        e.preventDefault()
        storage.trigger('save', {}, '', () => {
          previewPage(jQuery('#post-preview'))
        })
        return
      }
      let storageState = storage.state('status').get().status
      if (!dataSaved && (storageState === 'loaded' || storageState === 'changed')) {
        e.preventDefault()
        if (submitter === null) {
          submitter = $submitters[ 0 ]
        }
        $submitpost.find('#major-publishing-actions .spinner').addClass('is-active')
        dataSaved = true
        storage.trigger('save', {}, '', () => {
          submitter.classList.remove('disabled')
          setTimeout(() => {
            submitter.click()
          }, 150)
        })
      } else {
        dataSaved = false
      }
    }
  })

  let $notice = $('#local-storage-notice')
  $notice.find('.restore-backup').on('click.autosave-local', function (e) {
    let $postData = wp.autosave.local.getSavedPostData()
    let ajax = getService('utils').ajax

    ajax({
      'vcv-action': 'getRevisionData:adminNonce',
      'vcv-source-id': window.vcvSourceID,
      'vcv-nonce': window.vcvNonce
    }, (result) => {
      let response = JSON.parse(result.response)
      let vcvData = response.pageContent
      let request = JSON.stringify({
        post_content: $postData.content,
        status: true,
        data: vcvData
      })

      storage.state('status').set({
        status: 'loadSuccess',
        request: request
      })
    })
  })
  jQuery(document).on('before-autosave', function (e, saveObj) {
    if (!isClassicEditor()) {
      const documentData = documentManager.all()
      storage.trigger('wordpress:beforeSave', {
        pageElements: documentData
      })
      saveObj[ 'vcv-data' ] = encodeURIComponent(JSON.stringify({
        elements: documentData
      }))
    }
  })

  // Editor mode control.
  const beEditorInput = document.getElementById('vcv-be-editor')
  storage.state('activeEditor').set(beEditorInput && beEditorInput.value ? beEditorInput.value : 'be')
  const isClassicEditor = () => {
    return storage.state('activeEditor').get() === 'classic'
  }
  storage.state('activeEditor').onChange((state) => {
    beEditorInput.value = state
    workspaceStorage.state('settings').set(false)
    workspaceStorage.state('contentStart').set(false)
    if (state === 'be') {
      const dataStatus = storage.state('status').get()
      if (!dataStatus || !dataStatus.status || dataStatus.status !== 'loaded') {
        storage.trigger('start')
      }
    }
  })
})
