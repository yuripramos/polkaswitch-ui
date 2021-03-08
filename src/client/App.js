import React, { Component } from 'react';
require('./css/index.scss');

export default class App extends Component {

  render() {
    return (
      <div>
        <h1 class="title">
          Bulma
        </h1>

        <p class="subtitle">
          Modern CSS framework based on <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox">Flexbox</a>
        </p>

        <div class="field">
          <div class="control">
            <input class="input" type="text" placeholder="Input" />
          </div>
        </div>

        <div class="field">
          <p class="control">
            <span class="select">
              <select>
                <option>Select dropdown</option>
              </select>
            </span>
          </p>
        </div>

        <div class="buttons">
          <a class="button is-primary">Primary</a>
          <a class="button is-link">Link</a>
        </div>

        <span class="icon has-text-info">
          <i class="fas fa-info-circle"></i>
        </span>
        <span class="icon has-text-success">
          <i class="fas fa-check-square"></i>
        </span>
        <span class="icon has-text-warning">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
        <span class="icon has-text-danger">
          <i class="fas fa-ban"></i>
        </span>
      </div>
    );
  }
}
