(function () {
  'use strict';

  var decTest = '+locking-test';  // test that a password was correct
  var dataPlusTest;
  var state = {
    data: '',
    encrypted: false,
    decrypted: false
  };

  /**
  * Helper function to update the alert element in the DOM
  * @param {string|undefined} msg If a string it will be
  *   set in the dom and shown. If undefined clear the alert
  *   and hide the element
  */
  function alertHelper (msg) {
    var $alert = $('.alert');
    var show = msg !== undefined ? true : false;
    if (show) {
      $alert.html(msg);
      $alert.show();
    } else {
      $alert.html('');
      $alert.hide();
    }
  }

  /**
  * Callback handler for the decrypt method.
  * @param {string} result The encrypted data
  */
  function encryptHandler (result) {
    var $status = $('#status .label');
    var $result = $('#result-data');

    state.encrypted = true;
    state.decrypted = false;
    state.data = result;
    $result.html(state.data);
    $status.html('Encrypted');
  }

  /**
  * Callback handler for the decrypt method.
  * @param {string} result The decrypted data
  */
  function decryptHandler (result) {
    var $status = $('#status .label');
    var $result = $('#result-data');

    if (result.endsWith(decTest)) {
      state.data = result.split(decTest)[0];
      state.encrypted = false;
      state.decrypted = true;
      alertHelper();
      $result.html(state.data);
      $status.html('Decrypted');
    } else {
      alertHelper('Bad Password.');
    }
  }

  /**
  * Error callback handler for encrypt and decrypt method.
  * @param {string} err Error message
  */
  function errorHandler (err) {
    console.log('Error: ' + err)
    alertHelper('Something went wrong.<br>The password may be incorrect.');
  }

  /**
  * Update the global state object, data remains is only held in the
  * decrypt state
  */
  function updateState () {
    var radio = $('input:radio[name="encdec"]:checked').val();
    var $status = $('#status .label');
    var $result = $('#result-data');
    var $password = $('#password');
    var $data = $('#data');

    if (radio === 'encrypt' && $password.val() && $data.val()) {
      dataPlusTest = $data.val() + decTest;
      window.secret.encrypt(dataPlusTest, $password.val(), encryptHandler, errorHandler);
      dataPlusTest = '';
      $password.val('');
      $data.val('');
      alertHelper();
    } else if (radio === 'decrypt' && $password.val() && state.data) {
      window.secret.decrypt(state.data, $password.val(), decryptHandler, errorHandler);
      $password.val('');
      alertHelper();
    } else {
      alertHelper('Something went wrong.<br>Did you make sure to enter a password and some data?');
    }
  }

  // set up event listeners and initial dom state
  $('.alert').hide();

  $('#submit').on('click', function (evt) {
    updateState();
  });

  // hide the textarea element if decrypt is selected
  $('input:radio[name="encdec"]').change(function (evt) {
    var $dataForm = $('#data-form');
    if (this.value === 'decrypt') {
      $dataForm.hide();
    } else {
      $dataForm.show();
    }
  });

})();
