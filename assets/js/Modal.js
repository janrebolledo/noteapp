export default function Modal () {
    const open = document.querySelector('.notes__settings')
    const close = document.querySelector('.notes__settings-close')
    const modal = document.querySelector('.notes__settings-modal-container')

    open.addEventListener('click', () => {
        modal.classList.add('modal-open');
    })

    close.addEventListener('click', () => {
        modal.classList.remove('modal-open');
    })

    document.querySelectorAll(".notes__settings-modal-sidebar-item").forEach(button => {
        button.addEventListener("click", () => {
            const sidebar = button.parentElement;
            const tabsContainer = sidebar.parentElement;
            const tabNumber = button.dataset.forTab;
            const tabToActivate = tabsContainer.querySelector(`.notes__settings-modal-tab[data-tab="${tabNumber}"]`);

            sidebar.querySelectorAll(".notes__settings-modal-sidebar-item").forEach(button => {
                button.classList.remove("active-tab")
            });

            tabsContainer.querySelectorAll(".notes__settings-modal-tab").forEach(tab => {
                tab.classList.remove("active-tab")
            });

            button.classList.add("active-tab");

            tabToActivate.classList.add("active-tab");
        });
    });

    let darkMode = localStorage.getItem('dark-theme');
    const darkModeToggle = document.querySelector('#notes__settings-theme-changer');

    const enableDarkMode = () => {
        document.body.classList.add('dark-theme');
        localStorage.setItem('dark-theme', 'enabled');
    };

    const disableDarkMode = () => {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('dark-theme', null);
    };

    if (darkMode == 'enabled') {
        enableDarkMode();
    }

    darkModeToggle.addEventListener('click', () => {
        darkMode = localStorage.getItem('dark-theme');
        if (darkMode !== 'enabled') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });

    const button = document.querySelector(".mobile-menu-button")
    const menu = document.querySelector(".notes__sidebar")

    button.addEventListener('click', () => {
        if (menu.classList.contains("mobile-menu-open")) {
            menu.classList.remove("mobile-menu-open")
        } else {
        menu.classList.add("mobile-menu-open");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    Modal();
});