/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   api-body-editor-amf-overlay.html
 */

/// <reference path="../polymer/types/lib/utils/mixin.d.ts" />
/// <reference path="../polymer/types/lib/utils/render-status.d.ts" />

declare namespace ApiElements {


  /**
   * Adds AMF support to body editor.
   *
   * This mixin's only purpose is to keep AMF support separated from the
   * body editor code so it's clearer to read it.
   */
  function ApiBodyEditorAmfOverlay<T extends new (...args: any[]) => {}>(base: T): T & ApiBodyEditorAmfOverlayConstructor;

  interface ApiBodyEditorAmfOverlayConstructor {
    new(...args: any[]): ApiBodyEditorAmfOverlay;
  }

  interface ApiBodyEditorAmfOverlay {

    /**
     * `raml-aware` scope property to use.
     */
    aware: string|null|undefined;

    /**
     * AMF json/ld model for body.
     * When set it resets editor settings and transform it to work with
     * data types defined in AMF only.
     */
    amfBody: object|null;

    /**
     * Computed final model for payload.
     */
    _effectiveModel: object|null|undefined;

    /**
     * Computed value, `true` when `amfBody` is set.
     * This controls how the view is rendered. AMF model has limited
     * number of media types supported by the API. When not existing
     * the edtior renders all possible types.
     */
    readonly hasAmfBody: object|null;

    /**
     * List of supported mime types by this endpoint.
     * This information is read from AMF data model.
     */
    readonly mimeTypes: any[]|null|undefined;

    /**
     * Computed value.
     * It's `true` when the endpint supports single mime type.
     * In this case it won't render type selector.
     */
    readonly singleMimeType: object|null;

    /**
     * Computes value for `hasAmfBody`.
     *
     * @param amf AMF model for body.
     */
    _computeHasAmf(amf: object|null): Boolean|null;
    _clearAmfSettings(): void;

    /**
     * Creates a debouncer for body change action so it can be sure that
     * `amfModel` and `amfBody` properties are set.
     *
     * After debouncer timeout `__amfChanged()` is called with current value of
     * `amfBody`
     */
    _amfChanged(): void;

    /**
     * Ensures that the passed model is an array of
     * `http://raml.org/vocabularies/http#Payload`
     * in the AMF vocabulary.
     * The element accepts `http://www.w3.org/ns/hydra/core#Operation`,
     * `http://raml.org/vocabularies/http#Request` or array of
     * `http://raml.org/vocabularies/http#Payload` definitions.
     * It selectes the array from the model.
     *
     * @param model Passed model
     * @returns Payload model of undefined if the model
     * is invalid for this element.
     */
    _ensurePayloadModel(model: any[]|object|null): any[]|null|undefined;

    /**
     * Creates a list of media types supported by the endpoint as defined in
     * API spec file.
     *
     * @param model List of `Payload` definitions
     */
    _updateAmfMediaTypes(model: any[]|null): void;

    /**
     * Sets a content type property based on AMF mode's available options.
     * It sets the first defined media type in the model.
     *
     * This function **always** triggers the change by clearing `contentType`
     * first and then assigning new value.
     *
     * If the AMF model is a file model then it sets `fileAccept` property
     *
     * @param model List of `Payload` definitions
     */
    _selectDefaultMediaType(model: any[]|null): void;
    _updatePanelAmf(hasAmfBody: any, contentType: any): void;
    _schemaForMedia(mediaType: any): any;
    _typeHasModel(contentType: any): any;

    /**
     * Updates view model on panels that support the model.
     *
     * @param panel Current panel
     * @param contentType Current content type
     * @param schema A schema for current payload.
     */
    _updatePanelModel(panel: HTMLElement|null, contentType: String|null, schema: object|null): void;

    /**
     * To simplify things, this searches for first **object** from the union type
     * definition and returns its properties.
     *
     * The component do not offer an UI to selected union type.
     *
     * @param schema Payload's schema definition
     * @returns Properies of first object, if any.
     */
    _getUnionObjectProperties(schema: object|null): Array<object|null>|null|undefined;

    /**
     * Updates panel value depending on examples or type schema availability.
     *
     * @param panel Current panel
     * @param type Current content type
     * @param schema A schema for current payload.
     */
    _updatePanelValue(panel: HTMLElement|null, type: String|null, schema: object|null): Promise<any>|null;
  }
}
