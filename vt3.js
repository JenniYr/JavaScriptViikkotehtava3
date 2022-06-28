"use strict";  // pidä tämä ensimmäisenä rivinä
//@ts-check 

let labelForInputId = 3;

window.addEventListener("load", function() {
    console.log(data);

    let jaseninputit = this.document.getElementsByClassName("jasen");
    asetaEL(jaseninputit);

    let lahetaNappi = this.document.getElementById("nappi");
    lahetaNappi.addEventListener("click", laheta);

    let joukkueenNimi = this.document.getElementById("joukkueen_nimi");
    joukkueenNimi.addEventListener("blur", function(e){
        tarkistaJoukkueenNimi(e.target, "Joukkueen nimessä täytyy olla vähintään kaksi kirjainta");
      });

    joukkueenNimi.addEventListener("blur", function(e){
        tarkistaJoukkueenNimi2(e.target, "Tämä nimi on jo käytössä");
    });

    asetaLeimaustavat();
    asetaSarjat();
    listaaJoukkueet();

    
});



 /**
  * Listataan joukkueet lomakkeen alle
  */
function listaaJoukkueet(){
    let div = document.getElementById("joukkuelistaus");

    while(div.firstChild){
        div.removeChild(div.lastChild);
    }

    let ulUloin = document.createElement("ul");
    div.appendChild(ulUloin);

    for(let j of data.joukkueet){
        let liUloin = document.createElement("li");
        let strong = document.createElement("strong");
        let sarja = etsiSarja(j.sarja);
        strong.textContent = " " + sarja;
        let ulSisin = document.createElement("ul");
       

        for(let jasen of j.jasenet){
            let liSisin = document.createElement("li");
            liSisin.textContent = jasen;
            ulSisin.appendChild(liSisin);
        }

        liUloin.textContent = j.nimi;
        ulUloin.appendChild(liUloin);
        liUloin.appendChild(strong);
        liUloin.appendChild(ulSisin);
    }
}

function etsiSarja(sarjanId){
    
    let sarja ="";

    for(let s of data.sarjat){
        if(sarjanId == s.id){
            sarja = s.nimi;
        }
    }

    return sarja;
}

function onkoJoukkueenNimiUniikki(nimi){
    let onksKaikkiOkei = true;

    for(let j of data.joukkueet){
        if(nimi.toUpperCase() == j.nimi.toUpperCase()){
            onksKaikkiOkei = false;
        }
    }

    return onksKaikkiOkei;
}

 /**
  * Tarkistetaan, että ei yritetä lisätä saman nimistä joukkuetta.
  * Lisätty myös tähän samaan tarkistus, ettei kenttä ole pelkkää välilyöntiä.
  * @param {*} kentta 
  * @param {*} virhe 
  */
function tarkistaJoukkueenNimi2(kentta, virhe){
    let onksKaikkiOkei = true;
    let form = document.forms[0];
    let nimi = form.getElementsByClassName("inputJoukkueenNimi")[0].value.toUpperCase();

    onksKaikkiOkei = onkoJoukkueenNimiUniikki(nimi);

    if(onksKaikkiOkei == false){
        kentta.setCustomValidity(virhe);
        kentta.reportValidity();
    } else {
        kentta.setCustomValidity("");
        kentta.reportValidity();
    }

    if(nimi.trim() == ""){
        kentta.setCustomValidity("Nimi ei voi olla tyhjä");
        kentta.reportValidity();
    } else {
        kentta.setCustomValidity("");
        kentta.reportValidity();
    }
}

function tarkistaJoukkueenNimi(kentta, virhe){

    if (kentta.tooShort) {
        kentta.setCustomValidity(virhe);
        kentta.reportValidity();
    } else {
        kentta.setCustomValidity("");
        kentta.reportValidity();
    }
}

function asetaLeimaustavat(){
    let form = document.forms[0];
    let fieldset  = form[0];
    let pLeimaustavat = fieldset.children[2];
    let leimaustavat = data.leimaustapa;
    let br3 = document.createElement("br");
    pLeimaustavat.appendChild(br3);

    for(let l of leimaustavat){
        let p = document.createElement("p");
        p.setAttribute("class", "pLeimaustavat");

        let label = document.createElement("label");
        label.textContent = l;
        label.setAttribute("class", "leimaustapa");
        label.setAttribute("for", l);

        let input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("id", l);
        input.setAttribute("class", "leimaustapa");
      
       // pLeimaustavat.appendChild(label);
        //label.appendChild(input);
      
        //let br = document.createElement("br");
        //pLeimaustavat.appendChild(br);

        pLeimaustavat.appendChild(p);
        p.appendChild(label);
        p.appendChild(input);
    }
    
}

function asetaSarjat(){
    let form = document.forms[0];
    let fieldset  = form[0];
    let pSarjat = fieldset.children[3];
    let br3 = document.createElement("br");
    pSarjat.appendChild(br3);

    let sarjat = data.sarjat;
    sarjat.sort(jarjestaSarjat);

    for(let i=0; i<sarjat.length; i++){
        let label = document.createElement("label");
        label.setAttribute("class", "sarja");
        label.textContent = sarjat[i].nimi;
        label.setAttribute("for", sarjat[i].id );

        let input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("value", sarjat[i].nimi);
        input.setAttribute("name", "sarja");
        input.setAttribute("id", sarjat[i].id);
        input.setAttribute("class", "sarjaInput");

        let br = document.createElement("br");

        pSarjat.appendChild(label);
        label.appendChild(input);
        pSarjat.appendChild(br);
    }


    pSarjat.children[1].children[0].setAttribute("checked","true");
}

/**
 * Järjestä-funktio sarjojen järjestämiseen ennen kuin ne lisätään formiin
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function jarjestaSarjat(a,b){
    if(a.nimi>b.nimi){return 1;}
    if(a.nimi<b.nimi){return -1;}
    return 0;
}

/**
 * Asetetaan jasen inputeille eventListener
 * @param {Array} jasenet 
 */
function asetaEL(jasenet){
    for(let j of jasenet){
        j.addEventListener("input", inputTapahtuma);
        j.addEventListener("blur", tarkistaJasenV);
    }
}

/**
 * Funktio lähetä-napin painallukselle.
 * @param {*} e 
 */
function laheta(e){
    e.preventDefault();
    let onksKaikkiOkei = true;
    let form = document.forms[0]; //En tiedä onko tämä hyvä tapa hakea lomakkeita tai ylipäätään mitään? Tekee ohjelmasta vaikeamman hallita ja muokata
    let kentta = form.getElementsByClassName("inputJoukkueenNimi");
    
    if(kentta.tooShort){
        onksKaikkiOkei = false;
    }

    tarkistaJoukkueenNimi(kentta[0], "Joukkueen nimi on pakollinen ja siinä täytyy olla vähintään kaksi kirjainta");

    let jaseninputit = form.getElementsByClassName("jasen");
    let jasentenMaara= 0;
    for(let j of jaseninputit){
        let value = j.value.trim();
        if(value != ""){
            jasentenMaara++;
        }
    }

    if(jasentenMaara<2){
        onksKaikkiOkei = false;
        for(let j of jaseninputit){
            let value = j.value.trim();
            if(value == ""){
                j.setCustomValidity("Jäseniä täytyy antaa vähintään kaksi");
                j.reportValidity();
            }
        }
    }

    if(onksKaikkiOkei == true){
        tallennaJoukkue(form);
    }
}

function tallennaJoukkue(form){
    let joukkueenNimi = form.getElementsByClassName("inputJoukkueenNimi")[0].value.trim();
    let joukkueenJasenet  =form.getElementsByClassName("jasen");
    let sarja = form.getElementsByClassName("sarjaInput");
    let onksKaikkiOkei = true;

    let joukkueenjasenet = [];

        for(let i = 0; i<joukkueenJasenet.length; i++){
            let jasen = joukkueenJasenet[i].value;
            if(jasen != ""){
                joukkueenjasenet.push(jasen);
            }
        }
    
    if(joukkueenJasenet.length < 2){
        onksKaikkiOkei = false;
    }

    if(joukkueenNimi.trim() == ""){
        onksKaikkiOkei = false;
    }

    onksKaikkiOkei = onkoJoukkueenNimiUniikki(joukkueenNimi);

    let s;

    for(let i= 0; i<sarja.length; i++){
        if(sarja[i].checked == true){
            s = sarja[i].id;
        }
    }

    let id = haeUusiId(data.joukkueet);
    let leimaustapa = [];
    leimaustapa.push(0);
    let rastileimaukset = [];
    let uusiJoukkue;
    if(onksKaikkiOkei == true){
        uusiJoukkue = new UJ(joukkueenNimi, joukkueenjasenet, s, id, leimaustapa, rastileimaukset);
        data.joukkueet.push(uusiJoukkue);
        tyhjennaInputit();
    }

    console.log(data.joukkueet);
    listaaJoukkueet();

}

/**
 * Tyhjennetään lomakkeen kentät joukkueen lisäämisen jälkeen
 */
function tyhjennaInputit(){
    let form = document.forms[0];
    let nimi = form.getElementsByClassName("inputJoukkueenNimi");
    nimi[0].value = "";

    let jasenet = form.getElementsByClassName("jasen");
    for(let j of jasenet){
        j.value = "";
    }

    let pJasenet = form.getElementsByClassName("PJASENET");
    for(let i=pJasenet.length-1; i>1; i--){
        pJasenet[i].parentNode.removeChild(pJasenet[i]);
    }
}

class UJ{
    constructor(nimi, jasenet, sarja, id, leimaustapa, rastileimaukset){
        
        this.nimi = nimi;
        this.id = id;
        this.sarja = sarja; // KORJAA TÄMÄ, pitää olla int
        this.jasenet = jasenet;
        this.leimaustapa = leimaustapa;
        this.rastileimaukset = rastileimaukset;

    }
}

function haeUusiId(){
    let id = 0;
    let joukkueet = data.joukkueet;
    for(let j of joukkueet){
        if(j.id > id){
            id = j.id;
        }
    }
    id++;
    return id;
}

//Tätä ei varsinaisesti vaadittu, mutta tuli tehtyä samalla kun pähkäilin miten saan 
// validoinnin toimimaan. Laitoin aluksi jäsen inputeille required määrityksen, mutta
// antoi aina customErrorin ja en saanut sen kanssa toimimaan.
function tarkistaJasenV(e){

    let jasenInput = e.target;

    if(jasenInput.tooShort){
        jasenInput.setCustomValidity("TÄÄ EI TOIMI");
        jasenInput.reportValidity();
    } else {
        jasenInput.setCustomValidity("");
        jasenInput.reportValidity();
    }
}

/**
 * Input-tapahtuma. Mukailee luennoilla olevaa AddNew-funktiota, jossa
 * input kenttiä lisätään ja poistetaan sen mukaan miten niitä täytetään.
 * 23.6. Korjattu bugi joka oli viikkotehtävä 2:ssa
 */

function inputTapahtuma(e){
    e.preventDefault();
    let jasenForm = document.forms.lisaaJoukkue;
	let inputit = jasenForm.getElementsByClassName("jasen");
    let fieldset = jasenForm.fieldsetJasenet;

    let viimeinen_tyhja = -1;
        for(let i=inputit.length-1 ; i>-1; i--) {
            let input = inputit[i];

            if ( viimeinen_tyhja > -1 && input.value.trim() == "") { 
                let poistettava = inputit[viimeinen_tyhja].parentNode;
                poistettava.remove();
                viimeinen_tyhja = i;
            }
            
            if ( viimeinen_tyhja == -1 && input.value.trim() == "") {
                    viimeinen_tyhja = i;
            }
        }

let seuraavaLuku = inputit.length +1;
if (viimeinen_tyhja == -1) {
	let p = document.createElement("p");
    p.setAttribute("class", "PJASENET");
   
	let label = document.createElement("label");
	label.textContent = "Jäsen " + seuraavaLuku;
    label.setAttribute("class", "pJasenet");
    let forId = "jasen"+labelForInputId;
    label.setAttribute("for", forId);
    labelForInputId++;

	let input = document.createElement("input");
	input.setAttribute("type", "text");
	input.setAttribute("class", "jasen");
	input.addEventListener("input", inputTapahtuma);
    input.setAttribute("id", forId);
    input.setAttribute("minlength", "4");
    fieldset.appendChild(p);
    p.appendChild(label);
    p.appendChild(input);
    }

    let luku = 1;
    let labelit = jasenForm.getElementsByClassName("pJasenet");
    // Päivitetään labelit vastaamaan lisättyjä tai poistettuja
    for(let l of labelit){
        l.textContent = "Jäsen " + luku;
        luku++;
    }
}