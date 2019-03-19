var contacts = [];
var ids = 0;

var currentEditedShowedIndex;

var namee;
var phone;
var email;
var gender;
var fileImage;

var fileImageData;


function Contact(id, namee, phone, email, gender, image) {
    this.id = id;
    this.namee = namee;
    this.phone = phone;
    this.email = email;
    this.gender = gender;
    this.image = image;
}

function showDetails(indexInArray) {
    currentEditedShowedIndex = indexInArray;

    if (contacts[indexInArray].image == "")
        if (contacts[indexInArray].gender == false)
            $('#detailImage').attr('src', 'male.png');
        else
            $('#detailImage').attr('src', 'female.png');
    else
        $('#detailImage').attr('src', contacts[indexInArray].image);

    $('#callButton').attr('href', "tel:" + contacts[indexInArray].phone);

    $('#contactDetails').find('h1').first().text(contacts[indexInArray].namee);

}

function addOrSaveContact() {
    if ($('#addSaveButton').text() != "Save") {
        var contact;
        ids++;
        if(fileImage.val())
            contact = new Contact(ids, namee.val(), phone.val(), email.val(), gender.prop('checked'), fileImageData);
        else
            contact = new Contact(ids, namee.val(), phone.val(), email.val(), gender.prop('checked'), "");

        contacts.unshift(contact);

        var mainLink = $(document.createElement('a')).attr({
            href: "#contactDetails",
            "data-transition": "flip",
            class: "contact ui-btn"
        });

        var imag;

        if (contact.image == "")
            if (contact.gender == false)
                imag = $(document.createElement('img')).attr({
                    src: "male.png"
                });
            else
                imag = $(document.createElement('img')).attr({
                    src: "female.png"
                });
        else
            imag = $(document.createElement('img')).attr({
                src: contact.image
            });


        var contactnamee = $(document.createElement('h2')).text(contact.namee);

        mainLink.append(imag, contactnamee).on('click', function (event) {
            showDetails($(this).parent().index());
        });;

        var callLink = $(document.createElement('a')).attr({
            href: "tel:" + contact.phone,
            "data-transition": "pop",
            class: 'ui-btn ui-btn-icon-notext ui-icon-phone ui-btn-a'
        });

        var liElement = $(document.createElement('li')).attr({
            class: "ui-li-has-alt ui-li-has-thumb ui-first-child"
        }).append(mainLink, callLink);

        $('#contactList').prepend(liElement);

    }
    else {
        contacts[currentEditedShowedIndex].namee = namee.val();
        contacts[currentEditedShowedIndex].phone = phone.val();
        contacts[currentEditedShowedIndex].email = email.val();
        contacts[currentEditedShowedIndex].gender = gender.prop('checked');

        if (fileImage.val() != '')
            contacts[currentEditedShowedIndex].image = $('#prevImage').attr('src');

        var mainLiElement = $('#contactList').children().eq(currentEditedShowedIndex);
        mainLiElement.find('h2').text(contacts[currentEditedShowedIndex].namee);

        if (contacts[currentEditedShowedIndex].image == "")
            if (contacts[currentEditedShowedIndex].gender == false)
                mainLiElement.find('img').attr('src', 'male.png');
            else
                mainLiElement.find('img').attr('src', 'female.png');
        else
            mainLiElement.find('img').attr('src', contacts[currentEditedShowedIndex].image);
    }

    window.localStorage.setItem("contacts", JSON.stringify(contacts));
    $.mobile.navigate('#contactsPage');
    namee.val('');
    phone.val('');
    email.val('');
    gender.prop('checked', false);
    fileImage.val('');
    $('#prevImage').attr('src', 'no-image-icon-hi.png');
}


function deleteContact() {
    contacts.splice(currentEditedShowedIndex, 1);
    $('#contactList').children().eq(currentEditedShowedIndex).remove();
    $.mobile.navigate('#contactsPage');
    window.localStorage.setItem("contacts", JSON.stringify(contacts));
}

function loadFromLocalStorage() {

    if (window.localStorage.getItem("contacts") != null) {
        contacts = JSON.parse(localStorage.getItem("contacts"));
        for (var i = 0; i < contacts.length; i++) {

            var mainLink = $(document.createElement('a')).attr({
                href: "#contactDetails",
                "data-transition": "flip",
                class: "contact ui-btn"
            });

            var imag;

            if (contacts[i].image == "")
                if (contacts[i].gender == false)
                    imag = $(document.createElement('img')).attr({
                        src: "male.png"
                    });
                else
                    imag = $(document.createElement('img')).attr({
                        src: "female.png"
                    });
            else
                imag = $(document.createElement('img')).attr({
                    src: contacts[i].image
                });

            var contactnamee = $(document.createElement('h2')).text(contacts[i].namee);

            mainLink.append(imag, contactnamee).on('click', function (event) {
                showDetails($(this).parent().index());
            });;

            var callLink = $(document.createElement('a')).attr({
                href: "tel:" + contacts[i].phone,
                "data-transition": "pop",
                class: 'ui-btn ui-btn-icon-notext ui-icon-phone ui-btn-a'
            });

            var liElement = $(document.createElement('li')).attr({
                class: "ui-li-has-alt ui-li-has-thumb ui-first-child"
            }).append(mainLink, callLink);

            $('#contactList').append(liElement);
        }
    }
}

function ChangeImage() {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload=function (event) {
            fileImageData = event.target.result;
            $('#prevImage').attr('src', event.target.result);
        };

        reader.readAsDataURL(this.files[0]);
    }
}

$(function () {

    loadFromLocalStorage();
    namee = $('#namee');
    phone = $('#tel');
    email = $('#email');
    gender = $('#gender');
    fileImage = $('#fileImage');

    $('.contact').on('click', function (event) {
        showDetails($(this).parent().index());
    });

    $("#mainForm").on('submit', addOrSaveContact);

    $("#editButton").on('click', function () {
        $('#addSaveButton').text('Save');
        namee.val(contacts[currentEditedShowedIndex].namee);
        phone.val(contacts[currentEditedShowedIndex].phone);
        email.val(contacts[currentEditedShowedIndex].email);
        gender.prop('checked', contacts[currentEditedShowedIndex].gender).flipswitch().flipswitch('refresh');

        if(contacts[currentEditedShowedIndex].image != '')
            $('#prevImage').attr('src', contacts[currentEditedShowedIndex].image);
        else
            $('#prevImage').attr('src', 'no-image-icon-hi.png');

        $('#addEdit').find('h1').first().text("edit: " + contacts[currentEditedShowedIndex].namee);

        $.mobile.navigate('#addEdit');
    });

    $("#confirmDeleteButton").on('click', deleteContact);
    $("#fileImage").change(ChangeImage);

    $('#addButton').on('click', function(){
        $('#addEdit').find('h1').first().text("Add New Contact");
        namee.val('');
        phone.val('');
        email.val('');
        gender.prop('checked', false);
        fileImage.val('');
        $('#prevImage').attr('src', 'no-image-icon-hi.png');
    });
    




});