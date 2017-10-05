import React from 'react'
import lodash from 'lodash'
import Attribute from '../attribute'
import Devices from '../devices/Component'
import Toggle from '../toggle/Component'
import Dropdown from '../dropdown/Component'
import BoxModel from '../boxModel/Component'
import AttachImage from '../attachimage/Component'
import AttachVideo from '../attachvideo/Component'
import Color from '../color/Component'
import String from '../string/Component'
import Number from '../number/Component'
import Animate from '../animateDropdown/Component'
import ButtonGroup from '../buttonGroup/Component'
import Range from '../range/Component'
import IconPicker from '../iconpicker/Component'
import vcCake from 'vc-cake'

export default class DesignOptionsAdvanced extends Attribute {
  /**
   * Attribute Mixins
   */
  static attributeMixins = {
    boxModelMixin: {
      src: require('raw-loader!./cssMixins/boxModel.pcss'),
      variables: {
        device: {
          value: false
        },
        margin: {
          value: false
        },
        padding: {
          value: false
        },
        borderWidth: {
          value: false
        },
        borderRadius: {
          value: false
        },
        borderBottomLeftRadius: {
          value: false
        },
        borderBottomRightRadius: {
          value: false
        },
        borderBottomWidth: {
          value: false
        },
        borderLeftWidth: {
          value: false
        },
        borderRightWidth: {
          value: false
        },
        borderTopLeftRadius: {
          value: false
        },
        borderTopRightRadius: {
          value: false
        },
        borderTopWidth: {
          value: false
        },
        marginBottom: {
          value: false
        },
        marginLeft: {
          value: false
        },
        marginRight: {
          value: false
        },
        marginTop: {
          value: false
        },
        paddingBottom: {
          value: false
        },
        paddingLeft: {
          value: false
        },
        paddingRight: {
          value: false
        },
        paddingTop: {
          value: false
        },
        borderStyle: {
          value: false
        },
        borderTopStyle: {
          value: false
        },
        borderRightStyle: {
          value: false
        },
        borderBottomStyle: {
          value: false
        },
        borderLeftStyle: {
          value: false
        },
        borderColor: {
          value: false
        },
        borderTopColor: {
          value: false
        },
        borderRightColor: {
          value: false
        },
        borderBottomColor: {
          value: false
        },
        borderLeftColor: {
          value: false
        }
      }
    },
    visibilityMixin: {
      src: require('raw-loader!./cssMixins/visibility.pcss'),
      variables: {
        device: {
          value: `all`
        }
      }
    },
    backgroundColorMixin: {
      src: require('raw-loader!./cssMixins/backgroundColor.pcss'),
      variables: {
        device: {
          value: `all`
        },
        backgroundColor: {
          value: false
        }
      }
    },
    gradientMixin: {
      src: require('raw-loader!./cssMixins/gradientColor.pcss'),
      variables: {
        device: {
          value: `all`
        },
        startColor: {
          value: `rgba(0, 0, 0, 0)`
        },
        endColor: {
          value: `rgba(0, 0, 0, 0)`
        },
        angle: {
          value: 0
        }
      }
    },
    dividerMixin: {
      src: require('raw-loader!./cssMixins/divider.pcss'),
      variables: {
        device: {
          value: `all`
        }
      }
    }
  }

  /**
   * Default state values
   */
  static deviceDefaults = {
    backgroundType: 'imagesSimple',
    borderStyle: 'solid',
    backgroundStyle: 'cover',
    backgroundPosition: 'center-top',
    backgroundZoom: 50,
    backgroundZoomSpeed: 30,
    backgroundZoomReverse: false,
    gradientAngle: 45,
    sliderEffect: 'slide',
    dividerFlipHorizontal: 'horizontally-left',
    dividerFlipVertical: 'vertically-down',
    dividerPosition: 'top',
    dividerBackgroundType: 'color',
    dividerShape: { icon: 'vcv-ui-icon-dividers vcv-ui-icon-dividers-zigzag', iconSet: 'all' },
    dividerBackgroundColor: '#6567DF',
    dividerBackgroundGradientStartColor: 'rgb(226, 135, 135)',
    dividerBackgroundGradientEndColor: 'rgb(93, 55, 216)',
    dividerBackgroundGradientAngle: 0
  }
  static defaultState = {
    currentDevice: 'all',
    devices: {},
    attributeMixins: {}
  }

  constructor (props) {
    super(props)

    this.devicesChangeHandler = this.devicesChangeHandler.bind(this)
    this.deviceVisibilityChangeHandler = this.deviceVisibilityChangeHandler.bind(this)
    this.boxModelChangeHandler = this.boxModelChangeHandler.bind(this)
    this.attachImageChangeHandler = this.attachImageChangeHandler.bind(this)
    this.sliderTimeoutChangeHandler = this.sliderTimeoutChangeHandler.bind(this)
    this.parallaxSpeedChangeHandler = this.parallaxSpeedChangeHandler.bind(this)
    this.valueChangeHandler = this.valueChangeHandler.bind(this)
  }

  /**
   * Prepare data for setState
   * @param props
   * @returns {{value: *}}
   */
  updateState (props) {
    let newState = {}
    // data came from props if there is set value
    if (props.value) {
      newState = this.parseValue(props.value)
    } else {
      // data came from state update
      newState = lodash.defaultsDeep({}, props, DesignOptionsAdvanced.defaultState)
    }
    return newState
  }

  /**
   * Parse value data and set states based on it
   * @param value
   * @returns {*}
   */
  parseValue (value) {
    // set default values
    let newState = lodash.defaultsDeep({}, DesignOptionsAdvanced.defaultState)
    // get devices data
    let devices = this.getCustomDevicesKeys()
    // set current device
    if (!lodash.isEmpty(value.device)) {
      newState.currentDevice = Object.keys(value.device).shift()
    }
    // update devices values
    devices.push('all')
    devices.forEach((device) => {
      newState.devices[ device ] = lodash.defaultsDeep({}, DesignOptionsAdvanced.deviceDefaults)
      if (value.device && value.device[ device ]) {
        newState.devices[ device ] = lodash.defaultsDeep({}, value.device[ device ], newState.devices[ device ])
      }
    })

    return newState
  }

  addPixelToNumber (number) {
    return /^\d+$/.test(number) ? `${number}px` : number
  }

  /**
   * Update value
   * @param newState
   */
  updateValue (newState, fieldKey) {
    let newValue = {}
    let newMixins = {}

    // prepare data for state
    newState = this.updateState(newState)
    // save only needed data
    let checkDevices = []
    if (newState.currentDevice === 'all') {
      checkDevices.push('all')
    } else {
      checkDevices = checkDevices.concat(this.getCustomDevicesKeys())
    }
    checkDevices.forEach((device) => {
      if (!lodash.isEmpty(newState.devices[ device ])) {
        // set default values
        if (!newState.devices[ device ].backgroundType) {
          newState.devices[ device ].backgroundType = DesignOptionsAdvanced.deviceDefaults.backgroundType
        }
        if (!newState.devices[ device ].borderStyle) {
          newState.devices[ device ].borderStyle = DesignOptionsAdvanced.deviceDefaults.borderStyle
        }
        if (!newState.devices[ device ].backgroundStyle) {
          newState.devices[ device ].backgroundStyle = DesignOptionsAdvanced.deviceDefaults.backgroundStyle
        }
        if (!newState.devices[ device ].backgroundPosition) {
          newState.devices[ device ].backgroundPosition = DesignOptionsAdvanced.deviceDefaults.backgroundPosition
        }
        if (typeof newState.devices[ device ].gradientAngle === 'undefined') {
          newState.devices[ device ].gradientAngle = DesignOptionsAdvanced.deviceDefaults.gradientAngle
        }
        if (!newState.devices[ device ].dividerBackgroundStyle) {
          newState.devices[ device ].dividerBackgroundStyle = DesignOptionsAdvanced.deviceDefaults.backgroundStyle
        }
        if (!newState.devices[ device ].dividerBackgroundPosition) {
          newState.devices[ device ].dividerBackgroundPosition = DesignOptionsAdvanced.deviceDefaults.backgroundPosition
        }

        // values
        newValue[ device ] = lodash.defaultsDeep({}, newState.devices[ device ])
        // remove all values if display is provided
        if (newValue[ device ].hasOwnProperty('display')) {
          Object.keys(newValue[ device ]).forEach((style) => {
            if (style !== 'display') {
              delete newValue[ device ][ style ]
            }
          })
        } else {
          // Image type backgrounds
          let imgTypeBackgrounds = [
            'imagesSimple',
            'backgroundZoom',
            'imagesSlideshow'
          ]
          if (imgTypeBackgrounds.indexOf(newState.devices[ device ].backgroundType) === -1) {
            // not image type background selected
            delete newValue[ device ].images
            delete newValue[ device ].backgroundStyle
            delete newValue[ device ].backgroundPosition
            delete newValue[ device ].backgroundZoom
            delete newValue[ device ].backgroundZoomSpeed
            delete newValue[ device ].backgroundZoomReverse
          } else if (!newValue[ device ].hasOwnProperty('images') || ((!newValue[ device ].images.urls || newValue[ device ].images.urls.length === 0) && newValue[ device ].images.length === 0)) {
            // images are empty
            delete newValue[ device ].images
            delete newValue[ device ].backgroundType
            delete newValue[ device ].backgroundStyle
            delete newValue[ device ].sliderTimeout
            delete newValue[ device ].sliderDirection
            delete newValue[ device ].sliderEffect
            delete newValue[ device ].backgroundPosition
            delete newValue[ device ].backgroundZoom
            delete newValue[ device ].backgroundZoomSpeed
            delete newValue[ device ].backgroundZoomReverse
          }

          // Embed video bg
          let embedVideoTypeBackgrounds = [
            'videoEmbed'
          ]
          if (embedVideoTypeBackgrounds.indexOf(newState.devices[ device ].backgroundType) === -1) {
            // not image type background selected
            delete newValue[ device ].videoEmbed
          } else if (!newValue[ device ].hasOwnProperty('videoEmbed') || newValue[ device ].videoEmbed.urls.length === 0) {
            // images are empty
            delete newValue[ device ].videoEmbed
            delete newValue[ device ].backgroundType
          }

          // slider timeout is empty
          if (newValue[ device ].sliderTimeout === '' || newValue[ device ].backgroundType !== 'imagesSlideshow') {
            delete newValue[ device ].sliderTimeout
          }
          if (newValue[ device ].sliderEffect === '' || newValue[ device ].backgroundType !== 'imagesSlideshow') {
            delete newValue[ device ].sliderEffect
          }
          if (newValue[ device ].sliderDirection === '' || newValue[ device ].backgroundType !== 'imagesSlideshow' || newValue[ device ].sliderEffect !== 'carousel') {
            delete newValue[ device ].sliderDirection
          }

          // youtube video is empty
          if (newValue[ device ].backgroundType === 'videoYoutube') {
            if (!newValue[ device ].videoYoutube) {
              delete newValue[ device ].videoYoutube
              delete newValue[ device ].backgroundType
            }
          } else {
            delete newValue[ device ].videoYoutube
          }

          // vimeo video is empty
          if (newValue[ device ].backgroundType === 'videoVimeo') {
            if (!newValue[ device ].videoVimeo) {
              delete newValue[ device ].videoVimeo
              delete newValue[ device ].backgroundType
            }
          } else {
            delete newValue[ device ].videoVimeo
          }

          // gradient stat color is empty
          if (newValue[ device ].gradientStartColor === '') {
            delete newValue[ device ].gradientStartColor
          }

          // gradient end color is empty
          if (newValue[ device ].gradientEndColor === '') {
            delete newValue[ device ].gradientEndColor
          }

          // gradient angle is not set
          if (!newValue[ device ].gradientOverlay) {
            delete newValue[ device ].gradientAngle
            delete newValue[ device ].gradientEndColor
            delete newValue[ device ].gradientStartColor
            delete newValue[ device ].gradientOverlay
          } else if (!newValue[ device ].gradientStartColor && !newValue[ device ].gradientEndColor) {
            delete newValue[ device ].gradientOverlay
            delete newValue[ device ].gradientAngle
          }

          // background color is empty
          if (newValue[ device ].backgroundColor === '') {
            delete newValue[ device ].backgroundColor
          }

          let parallaxBackgrounds = [
            'imagesSimple',
            'backgroundZoom',
            'imagesSlideshow',
            'videoYoutube',
            'videoVimeo',
            'videoEmbed'
          ]
          if (parallaxBackgrounds.indexOf(newState.devices[ device ].backgroundType) === -1 || newValue[ device ].parallax === '') {
            // not parallax background selected
            delete newValue[ device ].parallax
            delete newValue[ device ].parallaxSpeed
          }

          // animation is not set
          if (newValue[ device ].animation === '') {
            delete newValue[ device ].animation
          }

          // border is empty
          if (newValue[ device ].borderColor === '') {
            delete newValue[ device ].borderColor
          }
          if (newValue[ device ].borderStyle === '') {
            delete newValue[ device ].borderStyle
          }
          if (!newValue[ device ].boxModel || !(newValue[ device ].boxModel.borderBottomWidth || newValue[ device ].boxModel.borderLeftWidth || newValue[ device ].boxModel.borderRightWidth || newValue[ device ].boxModel.borderTopWidth || newValue[ device ].boxModel.borderWidth)) {
            delete newValue[ device ].borderStyle
            delete newValue[ device ].borderColor
          }

          if (newState.devices[ device ].dividerBackgroundType !== 'image' && newState.devices[ device ].dividerBackgroundType !== 'videoEmbed') {
            delete newValue[ device ].dividerBackgroundImage
            delete newValue[ device ].dividerBackgroundStyle
            delete newValue[ device ].dividerBackgroundPosition
            delete newValue[ device ].dividerVideoEmbed
          }

          if (newState.devices[ device ].dividerBackgroundType === 'image' && (!newValue[ device ].hasOwnProperty('dividerBackgroundImage') || ((!newValue[ device ].dividerBackgroundImage.urls || newValue[ device ].dividerBackgroundImage.urls.length === 0) && newValue[ device ].dividerBackgroundImage.length === 0))) {
            delete newValue[ device ].dividerBackgroundStyle
            delete newValue[ device ].dividerBackgroundPosition
            delete newValue[ device ].dividerVideoEmbed
          }

          if (newState.devices[ device ].dividerBackgroundType === 'videoEmbed') {
            delete newValue[ device ].dividerBackgroundStyle

            if (!newValue[ device ].hasOwnProperty('dividerVideoEmbed') || !newValue[ device ].dividerVideoEmbed.urls || newValue[ device ].dividerVideoEmbed.urls.length === 0 && newValue[ device ].dividerVideoEmbed.length === 0) {
              delete newValue[ device ].dividerBackgroundPosition
              delete newValue[ device ].dividerBackgroundImage
            }
          }
        }
        // mixins
        if (newValue[ device ].hasOwnProperty('display')) {
          newMixins[ `visibilityMixin:${device}` ] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.visibilityMixin)
          newMixins[ `visibilityMixin:${device}` ].variables = {
            device: {
              value: device
            }
          }
        } else {
          // boxModelMixin
          if (newValue[ device ].hasOwnProperty('boxModel')) {
            let value = newValue[ device ].boxModel
            if (!lodash.isEmpty(value)) {
              // update mixin
              let mixinName = `boxModelMixin:${device}`
              newMixins[ mixinName ] = {}
              newMixins[ mixinName ] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.boxModelMixin)
              let syncData = {
                borderWidth: [ { key: 'borderStyle', value: 'borderStyle' }, { key: 'borderColor', value: 'borderColor' } ],
                borderTopWidth: [ { key: 'borderTopStyle', value: 'borderStyle' }, { key: 'borderTopColor', value: 'borderColor' } ],
                borderRightWidth: [ { key: 'borderRightStyle', value: 'borderStyle' }, { key: 'borderRightColor', value: 'borderColor' } ],
                borderBottomWidth: [ { key: 'borderBottomStyle', value: 'borderStyle' }, { key: 'borderBottomColor', value: 'borderColor' } ],
                borderLeftWidth: [ { key: 'borderLeftStyle', value: 'borderStyle' }, { key: 'borderLeftColor', value: 'borderColor' } ]
              }
              for (let property in value) {
                newMixins[ mixinName ].variables[ property ] = {
                  value: this.addPixelToNumber(value[ property ])
                }
                if (syncData[ property ]) {
                  syncData[ property ].forEach((syncProp) => {
                    let propVal = newValue[ device ][ syncProp.value ] || false
                    newMixins[ mixinName ].variables[ syncProp.key ] = {
                      value: this.addPixelToNumber(propVal)
                    }
                  })
                }
              }
              // devices
              newMixins[ mixinName ].variables.device = {
                value: device
              }
            }
          }
          // backgroundMixin
          if (newValue[ device ] && newValue[ device ].backgroundColor) {
            let mixinName = `backgroundColorMixin:${device}`
            newMixins[ mixinName ] = {}
            newMixins[ mixinName ] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.backgroundColorMixin)
            newMixins[ mixinName ].variables.backgroundColor = {
              value: newValue[ device ].backgroundColor
            }
            newMixins[ mixinName ].variables.device = {
              value: device
            }
          }
          // gradientMixin
          if (newValue[ device ] && newValue[ device ].gradientOverlay) {
            let mixinName = `gradientMixin:${device}`
            newMixins[ mixinName ] = {}
            newMixins[ mixinName ] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.gradientMixin)
            if (newValue[ device ].gradientStartColor) {
              newMixins[ mixinName ].variables.startColor = {
                value: newValue[ device ].gradientStartColor
              }
            }
            if (newValue[ device ].gradientEndColor) {
              newMixins[ mixinName ].variables.endColor = {
                value: newValue[ device ].gradientEndColor
              }
            }
            newMixins[ mixinName ].variables.angle = {
              value: newValue[ device ].gradientAngle || 0
            }
            newMixins[ mixinName ].variables.device = {
              value: device
            }
          }

          // dividerMixin
          if (newValue[ device ] && newValue[ device ].divider && (newValue[ device ].dividerBackgroundType === 'image' || newValue[ device ].dividerBackgroundType === 'videoEmbed')) {
            let mixinName = `dividerMixin:${device}`
            newMixins[ mixinName ] = {}
            newMixins[ mixinName ] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.dividerMixin)

            newMixins[ mixinName ].variables.device = {
              value: device
            }
          }
        }

        // remove device from list if it's empty
        if (!Object.keys(newValue[ device ]).length) {
          delete newValue[ device ]
        }
      }
    })

    this.setFieldValue(newValue, newMixins, fieldKey)
    this.setState(newState)
  }

  /**
   * Flush field value to updater
   * @param value
   * @param mixins
   */
  setFieldValue (value, mixins, innerFieldKey) {
    let { updater, fieldKey } = this.props
    updater(fieldKey, {
      device: value,
      attributeMixins: mixins
    }, innerFieldKey)
  }

  /**
   * Get custom devices
   * @returns Array
   */
  getCustomDevices () {
    return [
      {
        label: 'Desktop',
        value: 'xl',
        icon: 'vcv-ui-icon-desktop'
      },
      {
        label: 'Tablet Landscape',
        value: 'lg',
        icon: 'vcv-ui-icon-tablet-landscape'
      },
      {
        label: 'Tablet Portrait',
        value: 'md',
        icon: 'vcv-ui-icon-tablet-portrait'
      },
      {
        label: 'Mobile Landscape',
        value: 'sm',
        icon: 'vcv-ui-icon-mobile-landscape'
      },
      {
        label: 'Mobile Portrait',
        value: 'xs',
        icon: 'vcv-ui-icon-mobile-portrait'
      }
    ]
  }

  /**
   * Get custom devices keys
   * @returns {Array}
   */
  getCustomDevicesKeys () {
    return this.getCustomDevices().map((device) => {
      return device.value
    })
  }

  /**
   * Render device selector
   * @returns {XML}
   */
  getDevicesRender () {
    return <Devices
      api={this.props.api}
      fieldKey='currentDevice'
      options={{
        customDevices: this.getCustomDevices()
      }}
      updater={this.devicesChangeHandler}
      value={this.state.currentDevice} />
  }

  /**
   * Handle devices change
   * @returns {XML}
   */
  devicesChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, { [fieldKey]: value }, this.state)

    if (newState.currentDevice === 'all') {
      // clone data from xl in to all except display property
      newState.devices.all = lodash.defaultsDeep({}, newState.devices[ this.getCustomDevicesKeys().shift() ])
      delete newState.devices.all.display
    } else if (this.state.currentDevice === 'all') {
      // clone data to custom devices from all
      this.getCustomDevicesKeys().forEach((device) => {
        newState.devices[ device ] = lodash.defaultsDeep({}, newState.devices.all)
      })
    }

    this.updateValue(newState, fieldKey)
  }

  /**
   * Render device visibility toggle
   * @returns {XML}
   */
  getDeviceVisibilityRender () {
    if (this.state.currentDevice === 'all') {
      return null
    }

    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <Toggle
          api={this.props.api}
          fieldKey={`currentDeviceVisible`}
          updater={this.deviceVisibilityChangeHandler}
          options={{ labelText: `Show on device` }}
          value={!this.state.devices[ this.state.currentDevice ].display}
        />
      </div>
    )
  }

  /**
   * Handle show on device toggle change
   * @returns {XML}
   */
  deviceVisibilityChangeHandler (fieldKey, isVisible) {
    let newState = lodash.defaultsDeep({}, this.state)
    if (isVisible) {
      delete newState.devices[ this.state.currentDevice ].display
    } else {
      // set display to none
      newState.devices[ this.state.currentDevice ].display = 'none'
    }

    this.updateValue(newState, fieldKey)
  }

  /**
   * Handle simple fieldKey - value type change
   * @param fieldKey
   * @param value
   */
  valueChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = value
    this.updateValue(newState, fieldKey)
  }

  /**
   * Render background type dropdown
   * @returns {*}
   */
  getBackgroundTypeRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }
    let options = {
      values: [
        {
          label: 'Simple images',
          value: 'imagesSimple'
        },
        {
          label: 'Background zoom',
          value: 'backgroundZoom'
        },
        {
          label: 'Image slideshow',
          value: 'imagesSlideshow'
        },
        {
          label: 'Youtube video',
          value: 'videoYoutube'
        },
        {
          label: 'Vimeo video',
          value: 'videoVimeo'
        },
        {
          label: 'Self-hosted video',
          value: 'videoEmbed'
        }
      ]
    }
    let value = this.state.devices[ this.state.currentDevice ].backgroundType || DesignOptionsAdvanced.deviceDefaults.backgroundType
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Background type
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='backgroundType'
        options={options}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render box model
   * @returns {*}
   */
  getBoxModelRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }
    let value = this.state.devices[ this.state.currentDevice ].boxModel || {}

    let defaultStyles = this.getDefaultStyles()
    return <div className='vcv-ui-form-group'>
      <BoxModel
        api={this.props.api}
        fieldKey='boxModel'
        updater={this.boxModelChangeHandler}
        placeholder={defaultStyles}
        value={value} />
    </div>
  }

  /**
   * Get default element styles
   * @returns {{margin: {}, padding: {}, border: {}}}
   */
  getDefaultStyles () {
    let mainDefaultStyles = {
      margin: {},
      padding: {},
      border: {}
    }
    let doAttribute = 'data-vce-do-apply'
    let frame = document.querySelector('#vcv-editor-iframe')
    let frameDocument = frame.contentDocument || frame.contentWindow.document
    let elementIdSelector = `el-${this.props.element.data.id}`
    let element = frameDocument.querySelector(`#${elementIdSelector}`)
    let styles = [ 'border', 'padding', 'margin' ]

    if (element) {
      let dolly = element.cloneNode(true)
      dolly.id = ''
      dolly.height = '0'
      dolly.width = '0'
      dolly.overflow = 'hidden'
      dolly.position = 'fixed'
      dolly.bottom = '0'
      dolly.right = '0'
      element.parentNode.appendChild(dolly)

      let elementDOAttribute = element.getAttribute(doAttribute)

      if (elementDOAttribute) {
        let allDefaultStyles = this.getElementStyles(dolly)

        if (elementDOAttribute.indexOf('all') >= 0) {
          mainDefaultStyles.all = allDefaultStyles
        } else {
          styles.forEach((style) => {
            if (elementDOAttribute.indexOf(style) >= 0) {
              mainDefaultStyles[ style ] = allDefaultStyles
            } else {
              let innerSelector = `[${doAttribute}*='${style}'][${doAttribute}*='${elementIdSelector}']`
              mainDefaultStyles[ style ] = this.getElementStyles(dolly, innerSelector)
            }
          })
        }
      } else {
        let allStyleElement = dolly.querySelector(`[${doAttribute}*='all'][${doAttribute}*='${elementIdSelector}']`)

        if (allStyleElement) {
          let allDefaultStyles = this.getElementStyles(allStyleElement)
          mainDefaultStyles.all = allDefaultStyles
        } else {
          styles.forEach((style) => {
            let innerSelector = `[${doAttribute}*='${style}'][${doAttribute}*='${elementIdSelector}']`
            mainDefaultStyles[ style ] = this.getElementStyles(dolly, innerSelector)
          })
        }
      }

      dolly.remove()
    }

    let parsedStyles = {}
    for (let style in mainDefaultStyles) {
      let styleObject = mainDefaultStyles.all || mainDefaultStyles[ style ]
      for (let computedStyle in styleObject) {
        if (computedStyle.indexOf(style) >= 0) {
          parsedStyles[ computedStyle ] = styleObject[ computedStyle ]
        }
      }
    }
    return parsedStyles
  }

  /**
   * Gets additional style (margin, padding, border) element styles
   * @param clonedElement
   * @param innerSelector
   * @returns {{}}
   */
  getElementStyles (clonedElement, innerSelector) {
    let styles = {}
    if (clonedElement) {
      let defaultStyles = ''
      if (innerSelector) {
        defaultStyles = Object.assign({}, window.getComputedStyle(clonedElement.querySelector(innerSelector)))
      } else {
        defaultStyles = Object.assign({}, window.getComputedStyle(clonedElement))
      }

      for (let style in BoxModel.defaultState) {
        if (defaultStyles && defaultStyles[ style ] &&
          defaultStyles[ style ] !== '0px' &&
          defaultStyles[ style ].split(' ').length === 1) {
          styles[ style ] = defaultStyles[ style ]
        }
      }
    }
    return styles
  }

  /**
   * Handle box model change
   * @param fieldKey
   * @param value
   */
  boxModelChangeHandler (fieldKey, value) {
    let currentValue = this.state.devices[ this.state.currentDevice ].boxModel || {}

    if (!lodash.isEqual(currentValue, value)) {
      let newState = lodash.defaultsDeep({}, this.state)
      // update value
      if (lodash.isEmpty(value)) {
        delete newState.devices[ newState.currentDevice ].boxModel
      } else {
        newState.devices[ newState.currentDevice ].boxModel = value
      }
      this.updateValue(newState, fieldKey)
    }
  }

  /**
   * Render attach image
   * @returns {*}
   */
  getAttachImageRender () {
    let allowedBackgroundTypes = [
      'imagesSimple',
      'backgroundZoom',
      'imagesSlideshow'
    ]
    let backgroundTypeToSearch = this.state.devices[ this.state.currentDevice ].backgroundType
    if (!backgroundTypeToSearch) {
      backgroundTypeToSearch = this.state.backgroundType
    }
    if (this.state.devices[ this.state.currentDevice ].display ||
      allowedBackgroundTypes.indexOf(backgroundTypeToSearch) === -1) {
      return null
    }
    let value = this.state.devices[ this.state.currentDevice ].images || {}

    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Images
      </span>
      <AttachImage
        api={this.props.api}
        fieldKey='attachImage'
        options={{
          multiple: true
        }}
        updater={this.attachImageChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Handle attach image change
   * @param fieldKey
   * @param value
   */
  attachImageChangeHandler (fieldKey, value) {
    if (value.hasOwnProperty(value.draggingIndex)) {
      delete value.draggingIndex
    }
    let newState = lodash.defaultsDeep({}, this.state)
    // update value
    if (lodash.isEmpty(value)) {
      delete newState.devices[ newState.currentDevice ].images
    } else {
      newState.devices[ newState.currentDevice ].images = value
    }
    this.updateValue(newState, fieldKey)
  }

  /**
   * Render background style
   * @returns {*}
   */
  getBackgroundStyleRender () {
    let allowedBackgroundTypes = [
      'imagesSimple',
      'imagesSlideshow'
    ]

    if (this.state.devices[ this.state.currentDevice ].display ||
      allowedBackgroundTypes.indexOf(this.state.devices[ this.state.currentDevice ].backgroundType) === -1 || !this.state.devices[ this.state.currentDevice ].hasOwnProperty('images') || !this.state.devices[ this.state.currentDevice ].images.urls || this.state.devices[ this.state.currentDevice ].images.urls.length === 0) {
      return null
    }
    let options = {
      values: [
        {
          label: 'Cover',
          value: 'cover'
        },
        {
          label: 'Contain',
          value: 'contain'
        },
        {
          label: 'Full width',
          value: 'full-width'
        },
        {
          label: 'Full height',
          value: 'full-height'
        },
        {
          label: 'Repeat',
          value: 'repeat'
        },
        {
          label: 'Repeat horizontal',
          value: 'repeat-x'
        },
        {
          label: 'Repeat vertical',
          value: 'repeat-y'
        },
        {
          label: 'No repeat',
          value: 'no-repeat'
        }
      ]
    }
    let value = this.state.devices[ this.state.currentDevice ].backgroundStyle || DesignOptionsAdvanced.deviceDefaults.backgroundStyle
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Background style
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='backgroundStyle'
        options={options}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render background position control
   * @returns {*}
   */
  getBackgroundPositionRender () {
    let allowedBackgroundTypes = [
      'imagesSimple',
      'backgroundZoom',
      'imagesSlideshow'
    ]
    if (this.state.devices[ this.state.currentDevice ].display ||
      allowedBackgroundTypes.indexOf(this.state.devices[ this.state.currentDevice ].backgroundType) === -1 || !this.state.devices[ this.state.currentDevice ].hasOwnProperty('images') || !this.state.devices[ this.state.currentDevice ].images.urls ||
      this.state.devices[ this.state.currentDevice ].images.urls.length === 0) {
      return null
    }
    let options = {
      values: [
        {
          label: 'Left Top',
          value: 'left-top',
          icon: 'vcv-ui-icon-attribute-background-position-left-top'
        },
        {
          label: 'Center Top',
          value: 'center-top',
          icon: 'vcv-ui-icon-attribute-background-position-center-top'
        },
        {
          label: 'Right Top',
          value: 'right-top',
          icon: 'vcv-ui-icon-attribute-background-position-right-top'
        },
        {
          label: 'Left Center',
          value: 'left-center',
          icon: 'vcv-ui-icon-attribute-background-position-left-center'
        },
        {
          label: 'Center Center',
          value: 'center-center',
          icon: 'vcv-ui-icon-attribute-background-position-center-center'
        },
        {
          label: 'Right Center',
          value: 'right-center',
          icon: 'vcv-ui-icon-attribute-background-position-right-center'
        },
        {
          label: 'Left Bottom',
          value: 'left-bottom',
          icon: 'vcv-ui-icon-attribute-background-position-left-bottom'
        },
        {
          label: 'Center Bottom',
          value: 'center-bottom',
          icon: 'vcv-ui-icon-attribute-background-position-center-bottom'
        },
        {
          label: 'Right Bottom',
          value: 'right-bottom',
          icon: 'vcv-ui-icon-attribute-background-position-right-bottom'
        }
      ]
    }
    let value = this.state.devices[ this.state.currentDevice ].backgroundPosition || DesignOptionsAdvanced.deviceDefaults.backgroundPosition
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Background position
      </span>
      <ButtonGroup
        api={this.props.api}
        fieldKey='backgroundPosition'
        options={options}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render background zoom control
   * @returns {*}
   */
  getBackgroundZoomRender () {
    if (this.state.devices[ this.state.currentDevice ].display ||
      this.state.devices[ this.state.currentDevice ].backgroundType !== 'backgroundZoom' ||
      !this.state.devices[ this.state.currentDevice ].hasOwnProperty('images') ||
      !this.state.devices[ this.state.currentDevice ].images.urls ||
      this.state.devices[ this.state.currentDevice ].images.urls.length === 0
    ) {
      return null
    }
    let options = {
      min: 0,
      max: 100,
      measurement: '%'
    }
    let value = this.state.devices[ this.state.currentDevice ].backgroundZoom || DesignOptionsAdvanced.deviceDefaults.backgroundZoom
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Background zoom scale
      </span>
      <Range
        api={this.props.api}
        fieldKey='backgroundZoom'
        options={options}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render background zoom speed control
   * @returns {*}
   */
  getBackgroundZoomSpeedRender () {
    if (this.state.devices[ this.state.currentDevice ].display ||
      this.state.devices[ this.state.currentDevice ].backgroundType !== 'backgroundZoom' ||
      !this.state.devices[ this.state.currentDevice ].hasOwnProperty('images') ||
      !this.state.devices[ this.state.currentDevice ].images.urls ||
      this.state.devices[ this.state.currentDevice ].images.urls.length === 0
    ) {
      return null
    }
    let options = {
      min: 1,
      max: false
    }
    let value = this.state.devices[ this.state.currentDevice ].backgroundZoomSpeed || DesignOptionsAdvanced.deviceDefaults.backgroundZoomSpeed
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Background zoom time (in seconds)
      </span>
      <Number
        api={this.props.api}
        fieldKey='backgroundZoomSpeed'
        options={options}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render background zoom reverse control
   * @returns {*}
   */
  getBackgroundZoomReverseRender () {
    if (this.state.devices[ this.state.currentDevice ].display ||
      this.state.devices[ this.state.currentDevice ].backgroundType !== 'backgroundZoom' ||
      !this.state.devices[ this.state.currentDevice ].hasOwnProperty('images') ||
      !this.state.devices[ this.state.currentDevice ].images.urls ||
      this.state.devices[ this.state.currentDevice ].images.urls.length === 0
    ) {
      return null
    }
    let value = this.state.devices[ this.state.currentDevice ].backgroundZoomReverse || DesignOptionsAdvanced.deviceDefaults.backgroundZoomReverse

    return <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
      <Toggle
        api={this.props.api}
        fieldKey='backgroundZoomReverse'
        updater={this.valueChangeHandler}
        options={{ labelText: `Use reverse zoom` }}
        value={value}
      />
    </div>
  }

  /**
   * Render color picker for background color
   * @returns {*}
   */
  getBackgroundColorRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].backgroundColor || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Background color
      </span>
      <Color
        api={this.props.api}
        fieldKey='backgroundColor'
        updater={this.valueChangeHandler}
        value={value}
        defaultValue='' />
    </div>
  }

  /**
   * Render gradient overlay toggle
   * @returns {XML}
   */
  getGradientOverlayRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].gradientOverlay || false
    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <Toggle
          api={this.props.api}
          fieldKey='gradientOverlay'
          updater={this.valueChangeHandler}
          options={{ labelText: `Use gradient overlay` }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render color picker for gradient start color
   * @returns {*}
   */
  getGradientStartColorRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].gradientOverlay) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].gradientStartColor || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Start color
      </span>
      <Color
        api={this.props.api}
        fieldKey='gradientStartColor'
        updater={this.valueChangeHandler}
        value={value}
        defaultValue='' />
    </div>
  }

  /**
   * Render color picker for gradient end color
   * @returns {*}
   */
  getGradientEndColorRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].gradientOverlay) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].gradientEndColor || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        End color
      </span>
      <Color
        api={this.props.api}
        fieldKey='gradientEndColor'
        updater={this.valueChangeHandler}
        value={value}
        defaultValue='' />
    </div>
  }

  /**
   * Render border style dropdown
   * @returns {*}
   */
  getBorderStyleRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }
    let device = this.state.devices[ this.state.currentDevice ]
    if (!device.boxModel || !(device.boxModel.borderBottomWidth || device.boxModel.borderLeftWidth || device.boxModel.borderRightWidth || device.boxModel.borderTopWidth || device.boxModel.borderWidth)) {
      return null
    }

    let options = {
      values: [
        {
          label: 'Solid',
          value: 'solid'
        },
        {
          label: 'Dotted',
          value: 'dotted'
        },
        {
          label: 'Dashed',
          value: 'dashed'
        },
        {
          label: 'None',
          value: 'none'
        },
        {
          label: 'Hidden',
          value: 'hidden'
        },
        {
          label: 'Double',
          value: 'double'
        },
        {
          label: 'Groove',
          value: 'groove'
        },
        {
          label: 'Ridge',
          value: 'ridge'
        },
        {
          label: 'Inset',
          value: 'inset'
        },
        {
          label: 'Outset',
          value: 'outset'
        },
        {
          label: 'Initial',
          value: 'initial'
        },
        {
          label: 'Inherit',
          value: 'inherit'
        }
      ]
    }
    let value = this.state.devices[ this.state.currentDevice ].borderStyle || DesignOptionsAdvanced.deviceDefaults.borderStyle
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Border style
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='borderStyle'
        options={options}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render border color control
   * @returns {*}
   */
  getBorderColorRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }
    let device = this.state.devices[ this.state.currentDevice ]
    if (!device.boxModel || !(device.boxModel.borderBottomWidth || device.boxModel.borderLeftWidth || device.boxModel.borderRightWidth || device.boxModel.borderTopWidth || device.boxModel.borderWidth)) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].borderColor || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Border color
      </span>
      <Color
        api={this.props.api}
        fieldKey='borderColor'
        updater={this.valueChangeHandler}
        value={value}
        defaultValue='' />
    </div>
  }

  /**
   * Render slider timeout field
   * @returns {*}
   */
  getSliderTimeoutRender () {
    if (this.state.devices[ this.state.currentDevice ].display ||
      this.state.devices[ this.state.currentDevice ].backgroundType !== `imagesSlideshow`) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].sliderTimeout || ''
    let defaultValue = this.state.devices[ this.state.currentDevice ].sliderEffect === `carousel` ? 10 : 5
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Animation timeout (in seconds)
      </span>
      <Number
        api={this.props.api}
        fieldKey='sliderTimeout'
        updater={this.sliderTimeoutChangeHandler}
        placeholder={defaultValue}
        options={{
          min: 1,
          max: false
        }}
        value={value}
      />
    </div>
  }

  /**
   * Render grid slider direction field
   * @returns {*}
   */
  getSliderDirectionRender () {
    if (this.state.devices[ this.state.currentDevice ].display ||
      this.state.devices[ this.state.currentDevice ].backgroundType !== `imagesSlideshow` ||
      this.state.devices[ this.state.currentDevice ].sliderEffect !== `carousel`) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].sliderDirection || 'left'
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Slider direction
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='sliderDirection'
        updater={this.valueChangeHandler}
        placeholder='Left'
        options={{
          values: [
            { label: 'Left', value: 'left' },
            { label: 'Top', value: 'top' },
            { label: 'Right', value: 'right' },
            { label: 'Bottom', value: 'bottom' }
          ]
        }}
        value={value}
      />
    </div>
  }

  /**
   * Render slider effect type field
   * @returns {*}
   */
  getSliderEffectRender () {
    if (this.state.devices[ this.state.currentDevice ].display ||
      this.state.devices[ this.state.currentDevice ].backgroundType !== `imagesSlideshow`) {
      return null
    }

    let options = {
      values: [
        {
          label: 'Slide',
          value: 'slide'
        },
        {
          label: 'Fade',
          value: 'fade'
        },
        {
          label: 'Carousel',
          value: 'carousel'
        }
      ]
    }
    let value = this.state.devices[ this.state.currentDevice ].sliderEffect || DesignOptionsAdvanced.deviceDefaults.sliderEffect
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Slideshow effect
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='sliderEffect'
        options={options}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Handle slider timeout change
   * @param fieldKey
   * @param value
   */
  sliderTimeoutChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = parseInt(value)
    this.updateValue(newState, fieldKey)
  }

  /**
   * Render gradient angle control
   * @returns {*}
   */
  getGradientAngleRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].gradientOverlay) {
      return null
    }
    let value = this.state.devices[ this.state.currentDevice ].gradientAngle || DesignOptionsAdvanced.deviceDefaults.gradientAngle
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Gradient angle
      </span>
      <Range
        api={this.props.api}
        fieldKey='gradientAngle'
        updater={this.valueChangeHandler}
        options={{ min: 0, max: 180, measurement: '°' }}
        value={value}
      />
    </div>
  }

  /**
   * Render animation control
   * @returns {*}
   */
  getAnimationRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }
    let value = this.state.devices[ this.state.currentDevice ].animation || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Animate
      </span>
      <Animate
        api={this.props.api}
        fieldKey='animation'
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render Youtube video control
   * @returns {*}
   */
  getYoutubeVideoRender () {
    if (this.state.devices[ this.state.currentDevice ].display ||
      this.state.devices[ this.state.currentDevice ].backgroundType !== `videoYoutube`) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].videoYoutube || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        YouTube video link
      </span>
      <String
        api={this.props.api}
        fieldKey='videoYoutube'
        updater={this.valueChangeHandler}
        value={value}
      />
    </div>
  }

  /**
   * Render Vimeo video control
   * @returns {*}
   */
  getVimeoVideoRender () {
    if (this.state.devices[ this.state.currentDevice ].display ||
      this.state.devices[ this.state.currentDevice ].backgroundType !== `videoVimeo`) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].videoVimeo || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Vimeo video link
      </span>
      <String
        api={this.props.api}
        fieldKey='videoVimeo'
        updater={this.valueChangeHandler}
        value={value}
      />
    </div>
  }

  /**
   * Render parallax control
   * @returns {*}
   */
  getParallaxRender () {
    let allowedBackgroundTypes = [
      'imagesSimple',
      'backgroundZoom',
      'imagesSlideshow',
      'videoYoutube',
      'videoVimeo',
      'videoEmbed'
    ]

    if (this.state.devices[ this.state.currentDevice ].display ||
      allowedBackgroundTypes.indexOf(this.state.devices[ this.state.currentDevice ].backgroundType) === -1) {
      return null
    }

    let options = {
      values: [
        {
          label: 'None',
          value: ''
        },
        {
          label: 'Simple',
          value: 'simple'
        },
        {
          label: 'Simple with fade',
          value: 'simple-fade'
        }
      ]
    }
    let value = this.state.devices[ this.state.currentDevice ].parallax || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Parallax effect
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='parallax'
        options={options}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render parallax speed field
   * @returns {*}
   */
  getParallaxSpeedRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].parallax) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].parallaxSpeed || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Parallax effect speed
      </span>
      <Number
        api={this.props.api}
        fieldKey='parallaxSpeed'
        updater={this.parallaxSpeedChangeHandler}
        placeholder='30'
        options={{
          min: 1,
          max: false
        }}
        value={value}
      />
    </div>
  }

  /**
   * Handle parallax speed change
   * @param fieldKey
   * @param value
   */
  parallaxSpeedChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = parseInt(value)
    this.updateValue(newState, fieldKey)
  }

  /**
   * Render parallax reverse field
   * @returns {*}
   */
  getParallaxReverseRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].parallax) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].parallaxReverse || false
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Reverse parallax effect
      </span>
      <Toggle
        api={this.props.api}
        fieldKey='parallaxReverse'
        updater={this.valueChangeHandler}
        value={value}
      />
    </div>
  }

  /**
   * Render Self hosted video control
   * @returns {*}
   */
  getEmbedVideoRender () {
    if (this.state.devices[ this.state.currentDevice ].display ||
      this.state.devices[ this.state.currentDevice ].backgroundType !== `videoEmbed`) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].videoEmbed || {}
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Video
      </span>
      <AttachVideo
        api={this.props.api}
        fieldKey='videoEmbed'
        options={{
          multiple: false
        }}
        updater={this.valueChangeHandler}
        value={value} />
      <p className='vcv-ui-form-helper'>For better browser compatibility please use <b>mp4</b> video format</p>
    </div>
  }

  /**
   * Render divider toggle
   * @returns {XML}
   */
  getDividerRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !vcCake.env('CONTAINER_DIVIDER')) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].divider || false
    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <Toggle
          api={this.props.api}
          fieldKey='divider'
          updater={this.valueChangeHandler}
          options={{ labelText: `Enable shape divider` }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render divider flip button group
   * @returns {XML}
   */
  getDividerFlipRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].divider || !vcCake.env('CONTAINER_DIVIDER')) {
      return null
    }

    let options = {
      values: [
        {
          label: 'Left',
          value: 'horizontally-left',
          icon: 'vcv-ui-icon-attribute-mirror-horizontally-left'
        },
        {
          label: 'Right',
          value: 'horizontally-right',
          icon: 'vcv-ui-icon-attribute-mirror-horizontally-right'
        }
      ]
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerFlipHorizontal || DesignOptionsAdvanced.deviceDefaults.dividerFlipHorizontal
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Flip
        </span>
        <ButtonGroup
          api={this.props.api}
          fieldKey='dividerFlipHorizontal'
          options={options}
          updater={this.valueChangeHandler}
          value={value} />
      </div>
    )
  }

  /**
   * Render divider shape - icon picker
   * @returns {XML}
   */
  getDividerShapeRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].divider || !vcCake.env('CONTAINER_DIVIDER')) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerShape || DesignOptionsAdvanced.deviceDefaults.dividerShape

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Divider shape
        </span>
        <IconPicker
          api={this.props.api}
          fieldKey='dividerShape'
          options={{ iconType: 'shapes' }}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render divider width range
   * @returns {XML}
   */
  getDividerWidthRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].divider || !vcCake.env('CONTAINER_DIVIDER')) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerWidth || '100'
    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <span className='vcv-ui-form-group-heading'>
          Divider form scale
        </span>
        <Range
          api={this.props.api}
          fieldKey='dividerWidth'
          updater={this.valueChangeHandler}
          options={{ min: 100, max: 300, measurement: '%' }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render divider height range
   * @returns {XML}
   */
  getDividerHeightRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].divider || !vcCake.env('CONTAINER_DIVIDER')) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerHeight || '200'
    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <span className='vcv-ui-form-group-heading'>
          Divider size
        </span>
        <Range
          api={this.props.api}
          fieldKey='dividerHeight'
          updater={this.valueChangeHandler}
          options={{ min: 0, max: 1600, measurement: 'px' }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render divider background type dropdown
   * @returns {*}
   */
  getDividerBackgroundTypeRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].divider || !vcCake.env('CONTAINER_DIVIDER')) {
      return null
    }
    let options = {
      values: [
        {
          label: 'Color',
          value: 'color'
        },
        {
          label: 'Gradient',
          value: 'gradient'
        },
        {
          label: 'Image',
          value: 'image'
        }
      ]
    }

    if (vcCake.env('CONTAINER_DIVIDER_EMBED_VIDEO')) {
      options.values.push({
        label: 'Self-hosted video',
        value: 'videoEmbed'
      })
    }
    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundType || DesignOptionsAdvanced.deviceDefaults.dividerBackgroundType
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider background type
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='dividerBackgroundType'
        options={options}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render color picker for divider background color
   * @returns {*}
   */
  getDividerBackgroundColorRender () {
    let backgroundTypeToSearch = this.state.devices[ this.state.currentDevice ].dividerBackgroundType

    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].divider || backgroundTypeToSearch !== 'color' || !vcCake.env('CONTAINER_DIVIDER')) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundColor || DesignOptionsAdvanced.deviceDefaults.dividerBackgroundColor
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider background color
      </span>
      <Color
        api={this.props.api}
        fieldKey='dividerBackgroundColor'
        updater={this.valueChangeHandler}
        value={value}
        defaultValue={DesignOptionsAdvanced.deviceDefaults.dividerBackgroundColor} />
    </div>
  }

  /**
   * Render color picker for divider gradient background start color
   * @returns {*}
   */
  getDividerBackgroundGradientStartColorRender () {
    let backgroundTypeToSearch = this.state.devices[ this.state.currentDevice ].dividerBackgroundType

    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].divider || backgroundTypeToSearch !== 'gradient' || !vcCake.env('CONTAINER_DIVIDER')) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundGradientStartColor || DesignOptionsAdvanced.deviceDefaults.dividerBackgroundGradientStartColor
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider start color
      </span>
      <Color
        api={this.props.api}
        fieldKey='dividerBackgroundGradientStartColor'
        updater={this.valueChangeHandler}
        value={value}
        defaultValue={DesignOptionsAdvanced.deviceDefaults.dividerBackgroundGradientStartColor} />
    </div>
  }

  /**
   * Render color picker for divider gradient background end color
   * @returns {*}
   */
  getDividerBackgroundGradientEndColorRender () {
    let backgroundTypeToSearch = this.state.devices[ this.state.currentDevice ].dividerBackgroundType

    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].divider || backgroundTypeToSearch !== 'gradient' || !vcCake.env('CONTAINER_DIVIDER')) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundGradientEndColor || DesignOptionsAdvanced.deviceDefaults.dividerBackgroundGradientEndColor
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider end color
      </span>
      <Color
        api={this.props.api}
        fieldKey='dividerBackgroundGradientEndColor'
        updater={this.valueChangeHandler}
        value={value}
        defaultValue={DesignOptionsAdvanced.deviceDefaults.dividerBackgroundGradientEndColor} />
    </div>
  }

  /**
   * Render range input for divider gradient background angle
   * @returns {*}
   */
  getDividerBackgroundGradientAngleRender () {
    let backgroundTypeToSearch = this.state.devices[ this.state.currentDevice ].dividerBackgroundType

    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].divider || backgroundTypeToSearch !== 'gradient' || !vcCake.env('CONTAINER_DIVIDER')) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundGradientAngle || DesignOptionsAdvanced.deviceDefaults.dividerBackgroundGradientAngle
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider gradient angle
      </span>
      <Range
        api={this.props.api}
        fieldKey='dividerBackgroundGradientAngle'
        updater={this.valueChangeHandler}
        options={{ min: 0, max: 180, measurement: '°' }}
        value={value}
      />
    </div>
  }

  /**
   * Render attach image for divider background
   * @returns {*}
   */
  getDividerAttachImageRender () {
    let backgroundTypeToSearch = this.state.devices[ this.state.currentDevice ].dividerBackgroundType

    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].divider || backgroundTypeToSearch !== 'image' || !vcCake.env('CONTAINER_DIVIDER')) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundImage || ''

    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider image
      </span>
      <AttachImage
        api={this.props.api}
        fieldKey='dividerBackgroundImage'
        options={{
          multiple: false
        }}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render divider background style
   * @returns {*}
   */
  getDividerBackgroundStyleRender () {
    let backgroundTypeToSearch = this.state.devices[ this.state.currentDevice ].dividerBackgroundType

    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].divider ||
      backgroundTypeToSearch !== 'image' || !vcCake.env('CONTAINER_DIVIDER') || !this.state.devices[ this.state.currentDevice ].hasOwnProperty('dividerBackgroundImage') || !this.state.devices[ this.state.currentDevice ].dividerBackgroundImage.urls || this.state.devices[ this.state.currentDevice ].dividerBackgroundImage.urls.length === 0) {
      return null
    }

    let options = {
      values: [
        {
          label: 'Cover',
          value: 'cover'
        },
        {
          label: 'Contain',
          value: 'contain'
        },
        {
          label: 'Full width',
          value: 'full-width'
        },
        {
          label: 'Full height',
          value: 'full-height'
        },
        {
          label: 'Repeat',
          value: 'repeat'
        },
        {
          label: 'Repeat horizontal',
          value: 'repeat-x'
        },
        {
          label: 'Repeat vertical',
          value: 'repeat-y'
        },
        {
          label: 'No repeat',
          value: 'no-repeat'
        }
      ]
    }
    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundStyle || DesignOptionsAdvanced.deviceDefaults.backgroundStyle
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider background style
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='dividerBackgroundStyle'
        options={options}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render divider background position control
   * @returns {*}
   */
  getDividerBackgroundPositionRender () {
    let deviceData = this.state.devices[ this.state.currentDevice ]
    let backgroundTypeToSearch = deviceData.dividerBackgroundType

    if (deviceData.display || !deviceData.divider || !vcCake.env('CONTAINER_DIVIDER')) {
      return null
    }

    if (backgroundTypeToSearch !== 'image' && backgroundTypeToSearch !== 'videoEmbed') {
      return null
    }

    if (backgroundTypeToSearch === 'image' && (!deviceData.hasOwnProperty('dividerBackgroundImage') || !deviceData.dividerBackgroundImage.urls || deviceData.dividerBackgroundImage.urls.length === 0)) {
      return null
    }

    if (backgroundTypeToSearch === 'videoEmbed' && (!deviceData.hasOwnProperty('dividerVideoEmbed') || !deviceData.dividerVideoEmbed.urls || deviceData.dividerVideoEmbed.urls.length === 0 || !vcCake.env('CONTAINER_DIVIDER_EMBED_VIDEO'))) {
      return null
    }

    let options = {
      values: [
        {
          label: 'Left Top',
          value: 'left-top',
          icon: 'vcv-ui-icon-attribute-background-position-left-top'
        },
        {
          label: 'Center Top',
          value: 'center-top',
          icon: 'vcv-ui-icon-attribute-background-position-center-top'
        },
        {
          label: 'Right Top',
          value: 'right-top',
          icon: 'vcv-ui-icon-attribute-background-position-right-top'
        },
        {
          label: 'Left Center',
          value: 'left-center',
          icon: 'vcv-ui-icon-attribute-background-position-left-center'
        },
        {
          label: 'Center Center',
          value: 'center-center',
          icon: 'vcv-ui-icon-attribute-background-position-center-center'
        },
        {
          label: 'Right Center',
          value: 'right-center',
          icon: 'vcv-ui-icon-attribute-background-position-right-center'
        },
        {
          label: 'Left Bottom',
          value: 'left-bottom',
          icon: 'vcv-ui-icon-attribute-background-position-left-bottom'
        },
        {
          label: 'Center Bottom',
          value: 'center-bottom',
          icon: 'vcv-ui-icon-attribute-background-position-center-bottom'
        },
        {
          label: 'Right Bottom',
          value: 'right-bottom',
          icon: 'vcv-ui-icon-attribute-background-position-right-bottom'
        }
      ]
    }
    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundPosition || DesignOptionsAdvanced.deviceDefaults.backgroundPosition
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider background position
      </span>
      <ButtonGroup
        api={this.props.api}
        fieldKey='dividerBackgroundPosition'
        options={options}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render divider Self hosted video control
   * @returns {*}
   */
  getDividerEmbedVideoRender () {
    let backgroundTypeToSearch = this.state.devices[ this.state.currentDevice ].dividerBackgroundType

    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].divider || backgroundTypeToSearch !== 'videoEmbed' || !vcCake.env('CONTAINER_DIVIDER')) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerVideoEmbed || {}
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider background video
      </span>
      <AttachVideo
        api={this.props.api}
        fieldKey='dividerVideoEmbed'
        options={{
          multiple: false
        }}
        updater={this.valueChangeHandler}
        value={value} />
      <p className='vcv-ui-form-helper'>For better browser compatibility please use <b>mp4</b> video format</p>
    </div>
  }

  /**
   * @returns {XML}
   */
  render () {
    return (
      <div className='advanced-design-options'>
        {this.getDevicesRender()}
        <div className='vcv-ui-row vcv-ui-row-gap--md'>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            {this.getDeviceVisibilityRender()}
            {this.getBoxModelRender()}
          </div>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            {this.getBorderStyleRender()}
            {this.getBorderColorRender()}
            {this.getBackgroundTypeRender()}
            {this.getAttachImageRender()}
            {this.getSliderEffectRender()}
            {this.getSliderTimeoutRender()}
            {this.getSliderDirectionRender()}
            {this.getYoutubeVideoRender()}
            {this.getVimeoVideoRender()}
            {this.getEmbedVideoRender()}
            {this.getBackgroundStyleRender()}
            {this.getBackgroundPositionRender()}
            {this.getBackgroundZoomRender()}
            {this.getBackgroundZoomSpeedRender()}
            {this.getBackgroundZoomReverseRender()}
            {this.getBackgroundColorRender()}
            {this.getGradientOverlayRender()}
            {this.getGradientStartColorRender()}
            {this.getGradientEndColorRender()}
            {this.getGradientAngleRender()}
            {this.getParallaxRender()}
            {this.getParallaxSpeedRender()}
            {this.getParallaxReverseRender()}
            {this.getAnimationRender()}
            {this.getDividerRender()}
            {this.getDividerShapeRender()}
            {this.getDividerFlipRender()}
            {this.getDividerHeightRender()}
            {this.getDividerWidthRender()}
            {this.getDividerBackgroundTypeRender()}
            {this.getDividerBackgroundColorRender()}
            {this.getDividerBackgroundGradientStartColorRender()}
            {this.getDividerBackgroundGradientEndColorRender()}
            {this.getDividerBackgroundGradientAngleRender()}
            {this.getDividerAttachImageRender()}
            {this.getDividerBackgroundStyleRender()}
            {this.getDividerEmbedVideoRender()}
            {this.getDividerBackgroundPositionRender()}
          </div>
        </div>
      </div>
    )
  }
}
