/*
 * validator plugin
 *
 * Copyright (c) 2013 Filament Group, Inc.
 * Licensed under MIT
 */
(function( $, w ){
	"use strict";

	var Validator = function( element, opts ){
		if( !element ){
			throw new Error( "Element passed into Validator is not valid" );
		}
		opts = opts || {};
		opts.validatorClass = opts.validatorClass || "invalid";
		opts.$applyElement = $( opts.applyElement && opts.applyElement.length ? opts.applyElement : element );

		this.opts = opts;
		this.element = element;
		this.$element = $( element );

		this.type = this.$element.attr( "data-validate" );
		this.required = this.$element.is( "[required]" );
	};

	Validator.prototype.config = {};

	Validator.prototype.copy = {};

	Validator.prototype.validate = function(){
		var value = this.getValue(),
			result = this._isValid( value ),
			$error;

		this.opts.$applyElement[ result ? "removeClass" : "addClass" ]( "invalid" );

		$error = this.getErrorMessageElement();
		if( !result ) {
			$error.html( this.getErrorMessage( value ) );
		} else {
			$error.remove();
		}
		return result;
	};

	Validator.prototype._isSelect = function() {
		return this.element.tagName.toLowerCase() === "select";
	};

	Validator.prototype._isCheckboxRadio = function() {
		var type = this.$element.attr( 'type' );
		return type === 'radio' || type === 'checkbox';
	};

	Validator.prototype.getValue = function() {
		var $els, arr, options, selected;

		if( this._isSelect() ) {
			options = this.$element.find( 'option' );
			if( this.element.selectedIndex > -1 ){
				selected = $( options[ this.element.selectedIndex ] );
			} else {
				selected = null;
			}
		} else if( this._isCheckboxRadio() ) {
			$els = this.$element.closest( "form, body" ).find( '[name="' + this.$element.attr( 'name' ) + '"]:checked' );
		}

		if( options && options.length ){
			return selected;
		}

		if( $els ) {
			arr = [];
			$els.each(function(){
				arr.push(this.value !== "" ? this.value : null);
			});
			return $( arr ).get();
		}

		return this.element.value;
	};

	Validator.prototype._isValid = function( value ) {
		var result = false,
			method = this[ 'validate' + this.type ];

		if( value && value.length ) {
			if( !this.type ){
				result = true;
			} else if( this.type && method ){
				result = method.call( this, value );
			}
		} else {
			result = !this.required;
		}

		return result;
	};

	Validator.prototype.getErrorMessageElement = function() {
		var callback = this.opts.getErrorAnchor,
			$anchor = callback ? callback.call( this ) : this.opts.$applyElement,
			isPlaceAfter = $anchor.is( '[data-validate-after]' ),
			$existingError = $anchor[ isPlaceAfter ? 'next' : 'prev' ]().filter( '.error-msg' );

		return $existingError.length ? $existingError : $( '<div>' ).addClass( 'error-msg' )[ isPlaceAfter ? 'insertAfter' : 'insertBefore' ]( $anchor );
	};

	/*
		Order of message selection, if they exist:

		{TYPE} is `required` or the key from `data-validate`:
			this.message{TYPE}()
			data-message
			data-{TYPE}-message
			this.copy.{TYPE}.message
	 */
	Validator.prototype.getErrorMessage = function( value ) {
		var key, msg;
		if( !(value && value.length) ){
			key = "required";
		} else {
			key = this.type;
		}
		msg = this.$element.attr( "data-message" ) ||
			this.$element.attr( "data-" + key + "-message" ) ||
			this.copy[ key ].message;

		return this[ "message" + key ] ?
			this[ "message" + key ].call( this, value, msg ) :
			msg;
	};

	w.Validator = Validator;

}( jQuery, this ));
