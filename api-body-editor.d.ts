/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   api-body-editor.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {html, css, LitElement} from 'lit-element';

import {EventsTargetMixin} from '@advanced-rest-client/events-target-mixin/events-target-mixin.js';

import {ApiBodyEditorAmfOverlay} from './api-body-editor-amf-overlay.js';

declare namespace ApiElements {

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
   */
  class ApiBodyEditor extends
    EventsTargetBehavior(
    ApiBodyEditorAmfOverlay(
    Object)) {
    readonly currentPanel: HTMLElement|null;

    /**
     * Currently selected editor.
     *
     * - 0 for Raw editor
     * - 1 for Form data
     * - 2 for Multipart
     * - 3 for File
     */
    selected: number|null|undefined;

    /**
     * A HTTP body.
     *
     * Depending of current editor selection the type can vary.
     */
    value: String|FormData|File|null;

    /**
     * When set it attempts to run associated code mirror mode
     * (raw editor).
     * This element listens for the `content-type-changed` event and when
     * handled it will automatically update content type and `mode`.
     */
    contentType: string|null|undefined;

    /**
     * Computed value, if set then raw text input is hidden
     */
    noTextInput: boolean|null|undefined;

    /**
     * Computed value, if set then form data input is hidden
     */
    noFormData: boolean|null|undefined;

    /**
     * Computed value, if set then multipart input is hidden
     */
    noMultipart: boolean|null|undefined;

    /**
     * Computed value, if set then file input is hidden
     */
    noFile: boolean|null|undefined;

    /**
     * Computed value, true if the editor type selector is hidden.
     */
    _editorSelectorHidden: boolean|null|undefined;

    /**
     * If set it computes `hasOptional` property and shows checkbox in the
     * form to show / hide optional properties.
     */
    allowHideOptional: boolean|null|undefined;

    /**
     * If set, enable / disable param checkbox is rendered next to each
     * form item.
     */
    allowDisableParams: boolean|null|undefined;

    /**
     * When set, renders "add custom" item button.
     * If the element is to be used withouth AMF model this should always
     * be enabled. Otherwise users won't be able to add a parameter.
     */
    allowCustom: boolean|null|undefined;

    /**
     * Renders items in "narrow" view
     */
    narrow: boolean|null|undefined;

    /**
     * Enables Anypoint legacy styling
     */
    legacy: boolean|null|undefined;

    /**
     * Enables Material Design outlined style
     */
    outlined: boolean|null|undefined;

    /**
     * When set the editor is in read only mode.
     */
    readOnly: boolean|null|undefined;

    /**
     * When set all controls are disabled in the form
     */
    disabled: boolean|null|undefined;

    /**
     * Prohibits rendering of the documentation (the icon and the
     * description).
     */
    noDocs: boolean|null|undefined;

    /**
     * Handler for content type change.
     * Updates state of the UI depending on AMF model.
     *
     * @param contentType New content type value.
     * @param oldValue Previous value
     */
    _contentTypeChanged(contentType: String|null, oldValue: String|null): void;
    render(): any;
    _attachListeners(node: any): void;
    _detachListeners(node: any): void;
    _getApiMimeSelector(): any;
    _getDefaultMimeSelector(): any;

    /**
     * Creates instance of Raw body panel in a TemplateResult
     */
    _createRawPanel(): TemplateResult|null;

    /**
     * Creates instance of x-www-urlencoded body panel.
     */
    _createFormDataPanel(): TemplateResult|null;

    /**
     * Creates instance of File body panel.
     */
    _createFilePanel(): TemplateResult|null;

    /**
     * Creates instance of Multipart body panel.
     */
    _createMultipartPanel(): TemplateResult|null;

    /**
     * Handler for content type changed event.
     */
    _contentTypeHandler(e: CustomEvent|null): void;
    _hideAllEditors(): void;
    _renderAllEditors(): void;

    /**
     * Updates editors availability state depending on content type.
     *
     * @param contentType New content type value.
     * @param oldValue Previous value
     */
    _updateEditorsState(contentType: String|null, oldValue: String|null): void;

    /**
     * Replaces active body editor with new one.
     */
    _selectedChanged(selected: Number|null, oldValue: Number|null): void;

    /**
     * Notifies application about body change.
     *
     * @param value Value to notify
     */
    _notifyBodyChanged(value: String|FormData|File|null|undefined): void;

    /**
     * Dispatches analytics event.
     *
     * @param category Event category
     * @param action Event action
     * @param label Event label
     */
    _analyticsEvent(category: String|null, action: String|null, label: String|null): void;

    /**
     * Dispatches `send-request` custom event when the user pressed
     * `meta+enter` on Mac or `ctrl+enter` eklsewhere keys combination.
     */
    _payloadKeyDown(e: CustomEvent|null): void;

    /**
     * Computes a value of the hidden attribute of the editory type selector.
     * Some content types are supported by only one type of the editor so in
     * this cases the editor should be hidden.
     *
     * @param contentType Current content type.
     */
    _updateEditorSelectorHidden(contentType: String|null): void;

    /**
     * Coppies current response text value to clipboard.
     */
    _copyToClipboard(e: Event|null): void;
    _resetCopyButtonState(button: any): void;

    /**
     * Dispatches `content-type-changed` custom event when CT changes by
     * using type selection.
     *
     * @param type Content type value to announce.
     */
    _notifyContentTypeChange(type: String|null): void;

    /**
     * Notifies about content type change when type selection changes.
     */
    _typeSelectedChanged(e: CustomEvent|null): void;

    /**
     * A function to be called to refres current state of editor panel.
     * It is only called for the panels that support refreshing (raw editor)
     */
    refreshPanel(): void;
    _modelHandler(e: any): void;
    _typeSelectionHandler(e: any): void;
    _panelValueChanged(e: any): void;
  }
}

declare global {

  interface HTMLElementTagNameMap {
    "api-body-editor": ApiElements.ApiBodyEditor;
  }
}
