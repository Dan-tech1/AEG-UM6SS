function initContactForm(){let e=document.getElementById("contact-form");e&&e.addEventListener("submit",function(t){t.preventDefault();let n=document.getElementById("name").value,s=document.getElementById("email").value,a=document.getElementById("subject").value,o=document.getElementById("message").value;if(!n||!s||!a||!o){showNotification("Veuillez remplir tous les champs obligatoires.","error");return}if(!validateEmail(s)){showNotification("Veuillez entrer une adresse email valide.","error");return}showNotification("Votre message a \xe9t\xe9 envoy\xe9 avec succ\xe8s! Nous vous r\xe9pondrons dans les plus brefs d\xe9lais.","success"),e.reset()})}function validateEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}function showNotification(e,t){let n=document.createElement("div");n.className=`notification ${t}`,n.textContent=e,n.style.cssText=`
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${"success"===t?"#006B3C":"#d9534f"};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `,document.body.appendChild(n),setTimeout(()=>{n.style.transform="translateX(0)"},100),setTimeout(()=>{n.style.transform="translateX(100%)",setTimeout(()=>{n.parentNode&&document.body.removeChild(n)},300)},5e3)}document.addEventListener("DOMContentLoaded",function(){initContactForm()});