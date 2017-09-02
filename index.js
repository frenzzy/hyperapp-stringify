'use strict'

var selfClosingTags = require('self-closing-tags')
var uppercaseLetter = /[A-Z]/g
var dashReplacer = '-$&'
var textTypes = ['string', 'number', 'boolean']
var attributeRenameMap = {
  classname: 'class'
}

function stringifyStyle(style) {
  var keys = Object.keys(style)
  var keysLen = keys.length
  var inlineStyle = ''
  var curProp
  var i = 0

  for (; i < keysLen; i += 1) {
    curProp = keys[i]
    inlineStyle +=
      curProp.replace(uppercaseLetter, dashReplacer).toLowerCase() +
      ':' +
      style[curProp] +
      ';'
  }

  return inlineStyle
}

/**
 * Convert the hyperapp virtual dom structure into an html string
 * @param {object} vnode object or string
 * @return {string} html representation of the input
 */
function hyperappStringify(vnode) {
  var tag
  var data
  var children
  var attrKeys
  var attrKeysLen
  var childrenLen
  var i = 0
  var attrKey
  var attrRename
  var attrVal
  var attrs = ''
  var childHTML = ''

  if (textTypes.indexOf(typeof vnode) > -1) {
    return vnode.toString()
  }

  tag = vnode.tag || ''
  data = vnode.data || {}
  children = vnode.children || []

  attrKeys = Object.keys(data)
  attrKeysLen = attrKeys.length
  childrenLen = children.length

  for (; i < attrKeysLen; i += 1) {
    attrKey = attrKeys[i]
    attrVal = data[attrKey]

    if (attrKey === 'style') {
      attrVal = stringifyStyle(attrVal)
    }

    if (textTypes.indexOf(typeof attrVal) === -1) {
      continue
    }

    attrRename = attributeRenameMap[attrKey.toLowerCase()]

    if (attrRename !== undefined) {
      attrKey = attrRename
    }

    attrVal = attrVal.toString()

    if (attrVal.length === 0) {
      attrs += ' ' + attrKey
      continue
    }

    attrs += ' ' + attrKey + '="' + attrVal + '"'
  }

  // Get the child nodes of the current vnode
  for (i = 0; i < childrenLen; i += 1) {
    childHTML += hyperappStringify(children[i])
  }

  if (selfClosingTags.indexOf(tag) > -1 && childHTML === '') {
    // self-closing and no children
    return '<' + tag + attrs + '>'
  }

  // normal opening and closing tag with children
  return '<' + tag + attrs + '>' + childHTML + '</' + tag + '>'
}

module.exports = hyperappStringify
