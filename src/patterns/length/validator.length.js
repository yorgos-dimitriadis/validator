/*
 * validator plugin
 *
 * Copyright (c) 2013 Filament Group, Inc.
 * Licensed under MIT
 */

/* global Validator:true */
/* global jQuery:true */
(function( Validator, $, window, undefined ) {

	Validator.prototype.validatelength = function( value ){
		var result = false,
			min = this.$element.attr( "minlength" ),
			max = this.$element.attr( "maxlength" );

		if( ( !min || value.toString().length >= min ) && ( !max || value.toString().length <= max ) ) {
			result = true;
		}

		return result;
	};

	Validator.prototype.messagelength = function( value, msg ){
		var min = this.$element.attr( "minlength" ),
			max = this.$element.attr( "maxlength" );

		if( !min || value.toString().length >= min ) {
			return msg.minlength.replace( /\{\d\}/g, min );
		} else if( !max || value.toString().length <= max ) {
			return msg.maxlength.replace( /\{\d\}/g, min );
		}
	};

}( Validator, jQuery, this ));
