/*!
 * Froala Imgur Plugin
 * Written by Maxhou00 (houdais.m@gmail.com)
 * Tested with Froala v4.0.11 (https://www.froala.com/wysiwyg-editor)
 */

FroalaEditor.DefineIcon("buttonIcon", { SRC: "./assets/imgur-icon.png", template: "image" });
FroalaEditor.POPUP_TEMPLATES["imgurPlugin.insert"] = "[_BUTTONS_][_INPUT_LAYER_][_FOOTER_]";
FroalaEditor.PLUGINS.imgurPlugin = function (editor) {
  // Create custom popup.
  function initPopup() {
    // Load popup template.
    var popup_buttons = "";

    // Create the list of buttons.
    if (editor.opts.buttonIcon && editor.opts.buttonIcon.length > 0) {
      popup_buttons += '<div class="fr-buttons fr-tabs">';
      popup_buttons += editor.button.buildList(editor.opts.buttonIcon);
      popup_buttons += "</div>";
    }

    var input_layer = initPictureUploader(editor);
    var footer = initFooter();
    var template = {
      buttons: popup_buttons,
      input_layer: input_layer,
      footer: footer,
    };

    // Create popup.

    // The button's outerHeight is required in case the popup needs to be displayed above it.
    var $popup = editor.popups.create("imgurPlugin.insert", template);

    return $popup;
  }

  function initFooter() {
    const footer = `
      <div id='image_count' style="background-color: rgba(20, 20, 20, 0.6); padding: 5px; color: rgb(255, 255, 255);">
        Nothing to upload
      </div>
    `;

    return footer;
  }

  function initPictureUploader() {
    var input = '<div class="fr-input-line fr-active fr-layer" id="fr-input-line-' + editor.id + '">';

    input += `
      <div class="fr-text-edit-layer" style="text-overflow:ellipsis; overflow:hidden" >
        <input type="file" multiple id="imgurInputUpload"/>
      </div>
    </div>`;

    return input;
  }

  function showPopup() {
    // Get the popup object defined above.
    var $popup = editor.popups.get("imgurPlugin.insert");

    // If popup doesn't exist then create it.
    // To improve performance it is best to create the popup when it is first needed
    // and not when the editor is initialized.
    if (!$popup) {
      $popup = initPopup();
      initEventListenerForUpload();
    }

    resetPopup();

    editor.popups.setContainer("imgurPlugin.insert", editor.$tb);

    const $btn = editor.$tb.find('.fr-command[data-cmd="imgurUpload"]');
    const left = $btn.offset().left;
    const top = $btn.offset().top;

    editor.popups.show("imgurPlugin.insert", left, top, $btn.outerHeight());
  }

  function initEventListenerForUpload() {
    document.querySelector("#imgurInputUpload").addEventListener("change", function (event) {
      const client_id = editor.opts.imgurClientId;
      const uploaderInput = event.target;
      var files = uploaderInput.files;
      var uploadingImgCount = files.length;

      updateImageCounterDisplay(uploadingImgCount);

      Array.from(files).forEach(function (file) {
        let form = new FormData();

        form.append("image", file);
        $.ajax({
          url: "https://api.imgur.com/3/image",
          headers: { Authorization: "Client-ID " + client_id },
          type: "POST",
          data: form,
          cache: false,
          contentType: false,
          processData: false,
        }).always(function (result) {
          updateImageCounterDisplay(uploadingImgCount);
          uploadingImgCount--;
          if (result.status != 200) {
            alert("Failed to upload: " + result.responseJSON.data.error.message);
          } else {
            editor.image.insert(result.data.link, true);
          }
        });
      });
    });
  }

  function updateImageCounterDisplay(counter) {
    if (counter <= 1) {
      $("#image_count").text(counter + " image is uploading...");
    } else {
      $("#image_count").text(counter + " images are uploading...");
    }
  }

  function resetPopup() {
    var $popup = editor.popups.get("imgurPlugin.insert");
    var input = $popup.find("#imgurInputUpload");
    var imageCounterDisplay = $popup.find("#image_count");

    imageCounterDisplay.text("Nothing to upload");
    input.val(null);
  }

  function hidePopup() {
    editor.popups.hide("imgurPlugin.insert");
  }

  return {
    showPopup: showPopup,
    hidePopup: hidePopup,
  };
};

FroalaEditor.RegisterCommand("imgurUpload", {
  title: "Upload Image",
  icon: "buttonIcon",
  undo: true,
  focus: true,
  showOnMobile: true,
  refreshAfterCallback: false,
  plugin: "imgurPlugin",
  // Called when the button is hit.
  callback: function () {
    if (!this.popups.isVisible("imgurPlugin.insert")) {
      this.imgurPlugin.showPopup();
    } else {
      this.imgurPlugin.hidePopup();
    }
  },
});
