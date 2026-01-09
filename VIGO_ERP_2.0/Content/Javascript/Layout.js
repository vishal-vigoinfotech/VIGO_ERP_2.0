
$(document).ready(function () {
   
        // Profile Dropdown
        $('#profileBtn').click(function (e) {
            e.stopPropagation();
            $('#profileDropdown').toggleClass('opacity-0 invisible translate-y-4');
        });

    $(document).click(function () {
        $('#profileDropdown').addClass('opacity-0 invisible translate-y-4');
    });


    $(function () {

        let openMenu = null;

        $('.dropdown-toggle').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const $btn = $(this);
            const targetId = $btn.data('mega');
            const $target = $('#' + targetId);

            if (openMenu === targetId) {
                resetMega();
                openMenu = null;
                return;
            }

            // reset all
            resetMega();

            // show selected mega
            $target.removeClass('hidden');

            $('#megaDropdown')
                .removeClass('opacity-0 invisible -translate-y-4')
                .addClass('opacity-100 visible translate-y-0');

            $('#megaDropdownContainer')
                .removeClass('pointer-events-none')
                .addClass('pointer-events-auto');

   
            $(this).addClass('bg-indigo-800 text-white');
            $(this).find('span').addClass('text-white');
            $(this).find('svg').addClass('rotate-180 text-white');

            openMenu = targetId;
        });

        // click inside mega → keep open
        $('#megaDropdown').on('click', function (e) {
            e.stopPropagation();
        });

        // outside click → close
        $(document).on('click', function () {
            resetMega();
            openMenu = null;
        });

        function resetMega() {
            $('[id^="mega_"]').addClass('hidden');

            $('#megaDropdown')
                .addClass('opacity-0 invisible -translate-y-4')
                .removeClass('opacity-100 visible translate-y-0');

            //$('#megaDropdownContainer')
            //    .addClass('pointer-events-none')
            //    .removeClass('pointer-events-auto');

            $('.dropdown-toggle').each(function () {
                $(this)
                    .removeClass('bg-indigo-800');
                $(this).find('span')
                    .removeClass('bg-indigo-800 text-white')
                    .addClass('text-gray-800');

                $(this).find('svg')
                    .removeClass('rotate-180 text-white')
                    .addClass('text-gray-400');
            });

        }

    });


    // Prevent close when clicking inside mega dropdown
    $('#megaDropdown').click(function (e) {
        e.stopPropagation();
    });


    
        });




function retryConnection() {

    if (navigator.onLine) {
        if (location.pathname !== "/Admin/Dashboard") {
            location.href = "/Admin/Dashboard";
        }

    } else {
        if (location.pathname !== "/Admin/NoInternet") {
            location.href = "/Admin/NoInternet";
        }
    }
}

// When internet comes back
window.addEventListener("online", function () {
    retryConnection();
});

// When internet goes off
window.addEventListener("offline", function () {
    retryConnection();
});


$(document).ready(function () {


    $('#closeChangePassword, #cancelChangePassword').click(function () {
        $('#modal_emp_passreset').addClass('hidden');
    });

    $('#changePasswordModal').click(function (e) {
        if ($(e.target).is('#modal_emp_passreset')) {
            $(this).addClass('hidden');
        }
    });

    $('#btnChangePassword').on('click', function () {
        $("#lblerr_OldPass, #lblerr_NewPass, #lblerr_ConfPass").empty();
        $('#modal_emp_passreset').removeClass('hidden');
    });

});

const toggles = document.querySelectorAll('.dropdown-toggle');
const megaDropdown = document.getElementById('megaDropdown');

toggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();

        const targetId = btn.dataset.mega;
        if (!targetId) return;


        document.querySelectorAll('#megaDropdown > div')
            .forEach(d => d.classList.add('hidden'));

        const target = document.getElementById(targetId);
        target.classList.remove('hidden');

        const rect = btn.getBoundingClientRect();


        const grid = target.querySelector('.grid');
        const columns = grid.children.length;

        if (columns > 1) {
            // FULL WIDTH
            megaDropdown.style.left = '0px';
            megaDropdown.style.right = '0px';
            megaDropdown.style.width = '100%';
        } else {
            // AUTO WIDTH under button
            megaDropdown.style.width = 'auto';
            megaDropdown.style.left = rect.left + 'px';
            megaDropdown.style.right = 'auto';
        }

        megaDropdown.classList.remove(
            'opacity-0',
            'invisible',
            '-translate-y-4'
        );
    });
});

document.addEventListener('click', () => {
    megaDropdown.classList.add(
        'opacity-0',
        'invisible',
        '-translate-y-4'
    );
});

function ResetPassword() {
    $("#lblerr_OldPass, #lblerr_NewPass, #lblerr_ConfPass").empty();

    var oldPass = $('#OldPass').val().trim();
    var newPass = $('#NewPass').val().trim();
    var confPass = $('#ConfPass').val().trim();

    // Empty field validation
    if (!oldPass || !newPass || !confPass) {
        if (!oldPass) $("#lblerr_OldPass").text("Please enter your current password!");
        if (!newPass) $("#lblerr_NewPass").text("Please enter new password!");
        if (!confPass) $("#lblerr_ConfPass").text("Please confirm your new password!");
        return;
    }

    // New password match
    if (newPass !== confPass) {
        showToast("New password and confirmation must match!", "error");
        return;
    }

    // Strong password validation
    var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordPattern.test(newPass)) {
        $("#lblerr_NewPass").text("Password must be at least 8 characters and include uppercase, lowercase, number & special character!");
        return;
    }

    App.showLoader();


    $.ajax({
        type: "POST",
        url: "/Account/DashResetPassword",
        headers: { "Authorization": "Bearer " + accessToken },
        data: { OldPassword: oldPass, ConfirmPassword: confPass },
        async: true,
        dataType: "json",
        success: function (response) {
            App.hideLoader();
            if (response.success == true) {
                showToast(response.message, "success");
            } else {
                showToast(response.message, "error");
            }
            $('#OldPass, #NewPass, #ConfPass').val('');
            $('#modal_emp_passreset').addClass('hidden');
        },
        error: function () {
            App.hideLoader();
            showToast.error('Something went wrong!');
        }
    });
}

function showToast(message, type = "error") {

    const icons = {
        success: "✔",
        error: "✖",
        warning: "⚠"
    };

    const toast = $(`
                <div class="toast-card toast-${type}">
                    <div class="toast-icon">${icons[type]}</div>
                    <div class="toast-text">${message}</div>
                </div>
            `);

    $("#toastContainer").append(toast);

    // SHOW
    setTimeout(() => toast.addClass("show"), 50);

    // AUTO HIDE
    setTimeout(() => {
        toast.removeClass("show").addClass("hide");
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

window.App = window.App || {};

App.showLoader = function () {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    preloader.style.display = 'flex';
    preloader.classList.add('active');
};

App.hideLoader = function () {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    preloader.classList.remove('active');
    preloader.classList.add('Inactive');
    setTimeout(() => preloader.style.display = 'none', 800);
};




