/*
 * validator plugin
 *
 * Copyright (c) 2013 Filament Group, Inc.
 * Licensed under MIT
 */

/* global Validator:true */
/* global jQuery:true */
(function( Validator, $ ) {
  $.extend( Validator.prototype.copy, {
    "passwordconfirm" : {
      "message" : "Passwords must match."
    }
  });

}( Validator, jQuery ));