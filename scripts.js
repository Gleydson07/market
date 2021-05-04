const DOM = {
    toggleMenu(){
        document
            .getElementById('sidebar')
            .classList
            .toggle('off');
    },

    toggleModal(){
        document
            .querySelector('.container-modal')
            .classList
            .toggle('modal-active');
    }
}