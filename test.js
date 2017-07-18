'use strict'

var assert = require('assert')
var h = require('hyperapp').h
var hyperappToHtml = require('./index')

// example state that is rendered in `view` function
var state = {
  msg: 'hi'
}

// example actions that are ignored
var actions = {
  btnClick: function() {
    console.log('this is ignored by the renderer')
  }
}

var outputHtml

var expectedHtml =
  '<div id="view-outer" style="border:1px solid red;padding:0.3rem;">view ' +
  'outer text<div id="view-inner" style="border:1px solid green;-moz-borde' +
  'r-radius:0.3rem;-webkit-border-radius:0.3rem;-ms-border-radius:0.3rem;-' +
  'o-border-radius:0.3rem;">view inner text<button>click</button>state mes' +
  'sage hi</div></div>'

function view(state, actions) {
  var outerStyle = {
    border: '1px solid red',
    padding: '0.3rem'
  }
  var innerStyle = {
    border: '1px solid green',
    MozBorderRadius: '0.3rem',
    WebkitBorderRadius: '0.3rem',
    MsBorderRadius: '0.3rem',
    // this is a weird case. maybe you know how to fix?
    'O-borderRadius': '0.3rem'
  }
  return h('div', {id: 'view-outer', style: outerStyle}, [
    'view outer text',
    h('div', {id: 'view-inner', style: innerStyle}, [
      'view inner text',
      h('button', {onclick: actions.btnClick}, 'click'),
      'state message ',
      state.msg
    ])
  ])
}

//
// generate the html with state and actions
//
outputHtml = hyperappToHtml(view(state, actions))

console.log('\nexpected html:\n\n', expectedHtml, '\n')
console.log('output html:\n\n', outputHtml, '\n')

// test
assert.equal(outputHtml, expectedHtml, 'output should match expected')

// if no errors it worked
console.log('✅  it worked real gud 😉')
