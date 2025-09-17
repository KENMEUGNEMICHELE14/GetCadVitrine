
// SCROLL DOUX
function initSmoothScroll(){
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
}

function initContactForm(){
//on soumet le formulaire avec l'id contactForm est soumis
    const contactForm=document.getElementById("contactForm");
    if (contactForm){
        contactForm.addEventListener('submit',function(e){
        e.preventDefault();
        //ici, on envoir l'email
        envoyerEmail(e);

    });
}
}

function envoyerEmail(event){

// 1- Empecher e rechargeemnt de la page
event.preventDefault();

const submitBtn=event.target.querySelector('button[type="submit"]');
const btnText=submitBtn.querySelector('.btn-text');
const loadingSpinner=submitBtn.querySelector('.loading-spinner');// pour le cercle
const originalText=btnText.textContent;// on sauvegarde le texte original du bouton soumetttre

// ici submit represente tout le bouton or le bouton là est consitué du texte et du cercle

btnText.textContent="Envoi en cours ...";
submitBtn.disabled=true;// On désactive le bouton poué éviter les doubles clics
loadingSpinner.style.display='inline-block';


// 2- Envoyer l'email en utilisant les id des service mail et des templates
//event.target c'est le formulaire qui a été soumis
emailjs.sendForm("service_gmail","template_bnjfujv",event.target)
    .then(function(response){
    console.log("SUCCES !",response.status,response.text);
    alert("Merci, votre message a été envoyé avec succès !");
    event.target.reset();//vide le formulaire
    },function(error){
    console.log("ECHEC...",error);
    alert("Une erreur est survenue veuillez réessayer svp");
    })
    .finally(() => {
    // Réinitalisez le bouton
    btnText.textContent=originalText;
    submitBtn.disabled=false;
    loadingSpinner.style.display = 'none';
    });
}





// Lancer automatiquement apres le chargement des elements HTML c'est ca qui fait glisser
document.addEventListener('DOMContentLoaded',function(){
initSmoothScroll();
initContactForm();
const spinner = document.querySelector('.loading-spinner');
    if (spinner) spinner.style.display = 'none';
    initContactForm();
});
