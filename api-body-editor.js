/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { PolymerElement } from '../../@polymer/polymer/polymer-element.js';

import '../../@polymer/polymer/lib/elements/dom-if.js';
import '../../@polymer/polymer/lib/utils/render-status.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import '../../@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '../../@polymer/paper-listbox/paper-listbox.js';
import '../../@polymer/paper-item/paper-item.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../arc-icons/arc-icons.js';
import '../../clipboard-copy/clipboard-copy.js';
import '../../form-data-editor/form-data-editor.js';
import '../../raw-payload-editor/raw-payload-editor.js';
import '../../multipart-payload-editor/multipart-payload-editor.js';
import '../../files-payload-editor/files-payload-editor.js';
import '../../content-type-selector/content-type-selector.js';
import { EventsTargetBehavior } from '../../events-target-behavior/events-target-behavior.js';
import '../../api-form-mixin/api-form-styles.js';
import '../../api-view-model-transformer/api-view-model-transformer.js';
import '../../amf-helper-mixin/amf-helper-mixin.js';
import '../../raml-aware/raml-aware.js';
import '../../api-example-generator/api-example-generator.js';
import './api-body-editor-amf-overlay.js';
import { html } from '../../@polymer/polymer/lib/utils/html-tag.js';
/**
 * `api-body-editor`
 * Renders different types of body editors. It works with AMF data model
 * but can be used separately.
 *
 * ## AMF support
 *
 * The element supports [AMF](https://github.com/mulesoft/amf/)
 * `json-ld` model. The model can be generated from OAS or RAML spec by
 * default and other specs with appropriate plugin.
 *
 * The element accepts `http://www.w3.org/ns/hydra/core#Operation`,
 * `http://raml.org/vocabularies/http#Request` or array of
 * `http://raml.org/vocabularies/http#Payload` definitions in AMF
 * vocabulary.
 *
 * When AMF model is accepted it alters the UI to render only allowed
 * by the spec content types and therefore editors.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin ArcBehaviors.EventsTargetBehavior
 * @appliesMixin ApiElements.AmfHelperMixin
 * @appliesMixin ApiElements.ApiBodyEditorAmfOverlay
 */
class ApiBodyEditor extends
  ApiElements.ApiBodyEditorAmfOverlay(
    ApiElements.AmfHelperMixin(
      EventsTargetBehavior(PolymerElement))) {
  static get template() {
    return html`
    <style include="api-form-styles">
    :host {
      display: block;
      @apply --api-body-editor;
    }

    [hidden] {
      display: none !important;
    }

    .content-actions {
      @apply --layout-horizontal;
      @apply --layout-center;
      @apply --api-body-editor-content-actions;
    }

    paper-dropdown-menu {
      margin-right: 12px;
      @apply --payload-editor-dropdown;
    }

    paper-dropdown-menu.type {
      margin: 0 12px;
      min-width: 280px;
      @apply --payload-editor-dropdown-type;
    }

    .single-ct-label {
      @apply --arc-font-body1;
      margin: 0;
      color: var(--api-body-editor-single-media-type-label);
    }

    paper-item:hover {
      @apply --paper-item-hover;
    }
    </style>
    <template is="dom-if" if="[[aware]]">
      <raml-aware raml="{{amfModel}}" scope="[[aware]]"></raml-aware>
    </template>

    <div class="content-actions">
      <paper-icon-button icon="arc:content-copy" class="action-icon copy-action" on-click="_copyToClipboard" title="Copy current editor value to clipboard"></paper-icon-button>
      <template is="dom-if" if="[[hasAmfBody]]">
        <template is="dom-if" if="[[!singleMimeType]]">
          <paper-dropdown-menu class="amf-types" label="Select content type" no-label-float="">
            <paper-listbox slot="dropdown-content" attr-for-selected="data-mime" selected="{{contentType}}" on-selected-changed="_typeSelectedChanged">
              <template is="dom-repeat" items="[[mimeTypes]]">
                <paper-item data-mime\$="[[item]]">[[item]]</paper-item>
              </template>
            </paper-listbox>
          </paper-dropdown-menu>
        </template>
        <template is="dom-if" if="[[singleMimeType]]">
          <p class="single-ct-label">Media type: [[contentType]]</p>
        </template>
      </template>
      <template is="dom-if" if="[[!hasAmfBody]]">
        <content-type-selector content-type="{{contentType}}" events-target="[[eventsTarget]]">
          <paper-item data-type="application/octet-stream">Any file data</paper-item>
        </content-type-selector>
        <paper-dropdown-menu class="type" label="Editor view" hidden\$="[[editorSelectorHidden]]">
          <paper-listbox slot="dropdown-content" selected="{{selected}}">
            <paper-item data-source="raw" hidden\$="[[noTextInput]]">Raw input</paper-item>
            <paper-item data-source="urlencode" hidden\$="[[noFormData]]">Form data (www-url-form-encoded)</paper-item>
            <paper-item data-source="multipart" hidden\$="[[noMultipart]]">Multipart form data (multipart/form-data)</paper-item>
            <paper-item data-source="file" hidden\$="[[noFile]]">Single file</paper-item>
          </paper-listbox>
        </paper-dropdown-menu>
      </template>
    </div>
    <section class="body-panel"></section>
    <clipboard-copy></clipboard-copy>
    <api-view-model-transformer amf-model="[[amfModel]]" id="transformer"></api-view-model-transformer>
    <api-example-generator amf-model="[[amfModel]]" id="exampleGenerator"></api-example-generator>
`;
  }

  static get is() {
    return 'api-body-editor';
  }
  static get properties() {
    return {
      /**
       * Currently selected editor.
       *
       * - 0 for Raw editor
       * - 1 for Form data
       * - 2 for Multipart
       * - 3 for File
       */
      selected: {
        type: Number,
        value: 0,
        observer: '_selectedChanged'
      },
      /**
       * A HTTP body.
       *
       * Depending of current editor selection the type can vary.
       *
       * @type {String|FormData|File}
       */
      value: {
        type: String,
        value: '',
        notify: true,
        observer: '_valueChanged'
      },
      /**
       * When set it attempts to run associated code mirror mode
       * (raw editor).
       * This element listens for the `content-type-changed` event and when
       * handled it will automatically update content type and `mode`.
       */
      contentType: {
        type: String,
        observer: '_contentTypeChanged'
      },
      // Computed value, if set then raw text input is hidden
      noTextInput: Boolean,
      // Computed value, if set then form data input is hidden
      noFormData: Boolean,
      // Computed value, if set then multipart input is hidden
      noMultipart: Boolean,
      // Computed value, if set then file input is hidden
      noFile: Boolean,
      // Computed value, true if the editor type selector is hidden.
      editorSelectorHidden: {
        type: Boolean,
        readOnly: true,
        value: true
      },
      /**
       * If set it computes `hasOptional` property and shows checkbox in the
       * form to show / hide optional properties.
       */
      allowHideOptional: {
        type: Boolean,
        observer: '_allowHideOptionalChanged'
      },
      /**
       * If set, enable / disable param checkbox is rendered next to each
       * form item.
       */
      allowDisableParams: {
        type: Boolean,
        observer: '_allowDisableParamsChanged'
      },
      /**
       * When set, renders "add custom" item button.
       * If the element is to be used withouth AMF model this should always
       * be enabled. Otherwise users won't be able to add a parameter.
       */
      allowCustom: {
        type: Boolean,
        observer: '_allowCustomChanged'
      },
      /**
       * Renders items in "narrow" view
       */
      narrow: {
        type: Boolean,
        observer: '_narrowChanged'
      },
      /**
       * When set the editor is in read only mode.
       */
      readonly: {
        type: Boolean,
        observer: '_readonlyChanged'
      }
    };
  }

  /**
   * @return {HTMLElement} Currently rendered body panel.
   */
  get currentPanel() {
    if (!this.shadowRoot) {
      return;
    }
    const selector = '[data-body-panel]';
    return this.shadowRoot.querySelector(selector);
  }
  /**
   * @constructor
   */
  constructor() {
    super();
    this._contentTypeHandler = this._contentTypeHandler.bind(this);
    this._payloadKeyDown = this._payloadKeyDown.bind(this);
    this._panelValueChanged = this._panelValueChanged.bind(this);
  }

  _attachListeners(node) {
    node.addEventListener('content-type-changed', this._contentTypeHandler);
    this.addEventListener('keydown', this._payloadKeyDown);
  }

  _detachListeners(node) {
    node.removeEventListener('content-type-changed', this._contentTypeHandler);
    this.removeEventListener('keydown', this._payloadKeyDown);
  }
  /**
   * Handler for content type changed event.
   * @param {CustomEvent} e
   */
  _contentTypeHandler(e) {
    if (this.readonly) {
      return;
    }
    this.set('contentType', e.detail.value);
  }
  /**
   * Handler for content type change.
   * Updates state of the UI depending on AMF model.
   *
   * @param {String} contentType New content type value.
   * @param {String} oldValue Previous value
   */
  _contentTypeChanged(contentType, oldValue) {
    this._updateEditorsState(contentType, oldValue);
    this._updateEditorSelectorHidden(contentType);
    this._propertyChangeHandler('contentType', contentType);
  }

  _hideAllEditors() {
    this.noTextInput = true;
    this.noFormData = true;
    this.noMultipart = true;
    this.noFile = true;
  }

  _renderAllEditors() {
    this.noTextInput = false;
    this.noFormData = false;
    this.noMultipart = false;
    this.noFile = false;
  }
  /**
   * Updates editors availability state depending on content type.
   * @param {String} contentType New content type value.
   * @param {String} oldValue Previous value
   */
  _updateEditorsState(contentType, oldValue) {
    if (!contentType) {
      this._renderAllEditors();
      return;
    }
    const value = this.value;
    this._hideAllEditors();
    if (contentType.indexOf('multipart/form-data') === 0) {
      this.noTextInput = false;
      this.noMultipart = false;
      this.selected = 2;
      return;
    }
    if (oldValue && oldValue.indexOf('multipart/form-data') === 0) {
      this.value = '';
    }
    if (contentType === 'application/octet-stream' || (value instanceof Blob && oldValue !== undefined)) {
      this.noFile = false;
      this.selected = 3;
      return;
    }
    if (contentType.indexOf('json') !== -1) {
      this.noTextInput = false;
      this.selected = 0;
      return;
    }
    if (contentType === 'application/x-www-form-urlencoded') {
      this.noTextInput = false;
      this.noFormData = false;
      this.selected = 1;
      return;
    }
    this.noTextInput = false;
    this.selected = 0;
  }
  /**
   * Replaces active body editor with new one.
   *
   * @param {Number} selected
   * @param {Number} oldValue
   */
  _selectedChanged(selected, oldValue) {
    this.__removeExistingPanel();
    if (selected === -1 || selected === undefined || selected === null) {
      this._notifyBodyChanged();
      return;
    }
    if (oldValue !== undefined) {
      this._analyticsEvent('api-body-editor', 'usage-selection', selected);
    }
    this.__createBodyPanel(selected);
  }
  /**
   * Notifies application about body change.
   *
   * @param {String|FormData|File|undefined} value Value to notify
   */
  _notifyBodyChanged(value) {
    if (this.readonly) {
      return;
    }
    const e = new CustomEvent('body-value-changed', {
      detail: {
        value: value,
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(e);
  }
  /**
   * Removes any existing body panel from local DOM.
   */
  __removeExistingPanel() {
    const panel = this.currentPanel;
    if (!panel) {
      return;
    }
    const events = this.__currentListeners;
    if (events && events.size) {
      for (let [type, fn] of events.entries()) {
        panel.removeEventListener(type, fn);
        events.delete(type);
      }
      this.__currentListeners = undefined;
    }
    panel.parentNode.removeChild(panel);
  }

  __createBodyPanel(selected) {
    switch (selected) {
      case 0: this._createRawPanel(); break;
      case 1: this._createFormDataPanel(); break;
      case 2: this._createMultipartPanel(); break;
      case 3: this._createFilePanel(); break;
    }
    this._attachValues();
  }
  /**
   * Adds shared properties for all panels.
   *
   * @param {HTMLElement} panel
   * @param {String} type Body type.
   */
  __addCommonProperties(panel, type) {
    panel.eventsTarget = this.eventsTarget;
    panel.dataset.type = type;
    panel.dataset.bodyPanel = true;
    panel.allowDisableParams = this.allowDisableParams;
    panel.allowCustom = this.allowCustom;
    panel.narrow = this.narrow;
    panel.contentType = this.contentType;
    panel.allowHideOptional = this.allowHideOptional;
  }
  /**
   * Creates instance of Raw body panel and adds it to local DOM.
   */
  _createRawPanel() {
    const panel = document.createElement('raw-payload-editor');
    this.__addCommonProperties(panel, 'raw');
    this.shadowRoot.querySelector('.body-panel').appendChild(panel);
  }
  /**
   * Creates instance of Raw body panel and adds it to local DOM.
   */
  _createFormDataPanel() {
    const panel = document.createElement('form-data-editor');
    this.__addCommonProperties(panel, 'urlencode');
    this.shadowRoot.querySelector('.body-panel').appendChild(panel);
  }
  /**
   * Creates instance of Raw body panel and adds it to local DOM.
   */
  _createFilePanel() {
    const panel = document.createElement('files-payload-editor');
    this.__addCommonProperties(panel, 'file');
    this.shadowRoot.querySelector('.body-panel').appendChild(panel);
  }
  /**
   * Creates instance of Raw body panel and adds it to local DOM.
   */
  _createMultipartPanel() {
    const panel = document.createElement('multipart-payload-editor');
    this.__addCommonProperties(panel, 'formdata');
    this.shadowRoot.querySelector('.body-panel').appendChild(panel);
  }
  /**
   * Handler for the `value-changed` event dispatched by an editor panel.
   * Updates this element value reported back to the application and
   * dispatches `body-value-changed` custom event so elements without
   * direct access to this element can use this information.
   *
   * @param {CustomEvent} e
   */
  _panelValueChanged(e) {
    if (this.readonly) {
      return;
    }
    this._cancelValueSetOnPanel = true;
    this.value = e.detail.value;
    this._cancelValueSetOnPanel = false;
    this._notifyBodyChanged(e.detail.value);
  }
  /**
   * Attaches value and value change listeners to current editor
   * after it's created.
   */
  _attachValues() {
    const panel = this.currentPanel;
    this.__currentListeners = new Map();
    this.__currentListeners.set('value-changed', this._panelValueChanged);
    panel.addEventListener('value-changed', this._panelValueChanged);
    if (!this.hasAmfBody) {
      panel.value = this.value;
    }
  }
  /**
   * Dispatches analytics event.
   *
   * @param {String} category Event category
   * @param {String} action Event action
   * @param {String} label Event label
   */
  _analyticsEvent(category, action, label) {
    const e = new CustomEvent('send-analytics', {
      detail: {
        type: 'event',
        category: category,
        action: action,
        label: label
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(e);
  }
  /**
   * Dispatches `send-request` custom event when the user pressed
   * `meta+enter` on Mac or `ctrl+enter` eklsewhere keys combination.
   *
   * @param {CustomEvent} e
   */
  _payloadKeyDown(e) {
    if (e.key !== 'Enter') {
      return;
    }
    const actionKey = navigator.platform === 'MacIntel' ? 'metaKey' : 'ctrlKey';
    if (!e[actionKey]) {
      return;
    }
    this.dispatchEvent(new CustomEvent('send-request', {
      cancelable: true,
      bubbles: true,
      composed: true
    }));
  }
  /**
   * Computes a value of the hidden attribute of the editory type selector.
   * Some content types are supported by only one type of the editor so in
   * this cases the editor should be hidden.
   *
   * @param {String} contentType Current content type.
   */
  _updateEditorSelectorHidden(contentType) {
    let result;
    const value = this.value;
    if (!contentType) {
      result = false;
    } else if (value instanceof Blob) {
      result = true;
    } else if (contentType.indexOf('json') !== -1) {
      result = true;
    } else if (contentType.indexOf('x-www-form-urlencoded') !== -1) {
      result = false;
    } else if (contentType.indexOf('multipart/') !== -1) {
      result = false;
    } else {
      result = true;
    }
    this._setEditorSelectorHidden(result);
  }
  /**
   * Updates property value on current panel.
   *
   * @param {String} prop Name of the proeprty to set
   * @param {any} value New value to set.
   */
  _propertyChangeHandler(prop, value) {
    const panel = this.currentPanel;
    if (!panel) {
      return;
    }
    panel[prop] = value;
  }
  /**
   * Updates value of the panel if `value` change and it is not
   * internal change.
   *
   * @param {String|FormData|File} value New value to set.
   */
  _valueChanged(value) {
    if (this._cancelValueSetOnPanel) {
      return;
    }
    this._propertyChangeHandler('value', value);
  }
  /**
   * Updates `allowHideOptional` on a panel.
   *
   * @param {Boolean} value New value to set.
   */
  _allowHideOptionalChanged(value) {
    this._propertyChangeHandler('allowHideOptional', value);
  }
  /**
   * Updates `allowDisableParams` on a panel.
   *
   * @param {Boolean} value New value to set.
   */
  _allowDisableParamsChanged(value) {
    this._propertyChangeHandler('allowDisableParams', value);
  }
  /**
   * Updates `allowCustom` on a panel.
   *
   * @param {Boolean} value New value to set.
   */
  _allowCustomChanged(value) {
    this._propertyChangeHandler('allowCustom', value);
  }
  /**
   * Updates `narrow` on a panel.
   *
   * @param {Boolean} value New value to set.
   */
  _narrowChanged(value) {
    this._propertyChangeHandler('narrow', value);
  }
  /**
   * Updates `readonly` on a panel.
   *
   * @param {Boolean} value New value to set.
   */
  _readonlyChanged(value) {
    this._propertyChangeHandler('readonly', value);
  }
  /**
   * Copies current body text value to clipboard.
   *
   * @param {Event} e
   */
  _copyToClipboard(e) {
    const button = e.target;
    const copy = this.shadowRoot.querySelector('clipboard-copy');
    copy.content = this.value;
    if (copy.copy()) {
      button.icon = 'arc:done';
    } else {
      button.icon = 'arc:error';
      this.dispatchEvent(new CustomEvent('send-analytics', {
        cancelable: true,
        bubbles: true,
        composed: true,
        detail: {
          type: 'exception',
          description: 'Copy to clipboard error - raml-body-editor',
          fatal: false
        }
      }));
    }
    setTimeout(() => this._resetCopyButtonState(button), 1000);
    this._analyticsEvent('api-body-editor', 'Copy to clipboard');
  }
  /**
   * Resets state of the copy button.
   * @param {Element} button
   */
  _resetCopyButtonState(button) {
    button.icon = 'arc:content-copy';
  }
  /**
   * Dispatches `content-type-changed` custom event when CT changes by
   * using type selection.
   * @param {String} type Content type value to announce.
   */
  _notifyContentTypeChange(type) {
    if (this.readonly) {
      return;
    }
    this.dispatchEvent(new CustomEvent('content-type-changed', {
      bubbles: true,
      composed: true,
      detail: {
        value: type
      }
    }));
  }
  /**
   * Notifies about content type change when type selection changes.
   * @param {CustomEvent} e
   */
  _typeSelectedChanged(e) {
    if (!e.detail.value) {
      return;
    }
    this._notifyContentTypeChange(e.detail.value);
  }
  /**
   * A function to be called to refres current state of editor panel.
   * It is only called for the panels that support refreshing (raw editor)
   */
  refreshPanel() {
    switch (this.selected) {
      case 0:
        const panel = this.currentPanel;
        if (panel) {
          panel.refresh();
        }
        break;
    }
  }
  /**
   * Fires when the value change.
   *
   * @event body-value-changed
   * @param {String} value Current editor value
   */
  /**
   * Dispatched when the request should be invoked.
   *
   * @event send-request
   */

  /**
   * Dispatched when the user select media type from the list of available types.
   *
   * @event content-type-changed
   * @param {String} value New content type value.
   */
}

window.customElements.define(ApiBodyEditor.is, ApiBodyEditor);
