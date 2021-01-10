


// Třída knihovna, reprezentuje knihovnu
class Kniha {
    constructor(id, autor, nazev, zanr, pozn) {
        this.id = id;
        this.autor = autor;
        this.nazev = nazev;
        this.zanr = zanr;
        this.pozn = pozn;
    }
}



// Třída UI, stará se o UI úkoly
class UI {
    static displayKnihy() {
        const list = document.querySelector('#kniha-list');
        
        while (list.firstChild) {
            list.firstChild.remove();
        }

        const knihy = Store.getKnihy();
        knihy.sort(function(a, b){
            if(a.autor < b.autor) { return -1; }
            if(a.autor > b.autor) { return 1; }
            return 0;
        })
        
        knihy.forEach((kniha) => UI.addKnihaToList(list, kniha));
    }

    static myFunction() {
        const x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    }


    //Přidání položky do listu
    static addKnihaToList(list, kniha) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${kniha.id}</td>
            <td>${kniha.autor}</td>
            <td>${kniha.nazev}</td>
            <td>${kniha.zanr}</td>
            <td>${kniha.pozn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete" onclick="Store.confirmDelete()">X</a></td>
        `;

        list.appendChild(row);
    }


    //Odebrání položky
    static deleteKniha(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }


    // vyčistí pole po přidání položky do seznamu
    static clearFields() {        
        document.getElementById("kniha-form").reset();
    }
}



// Třída Store, stará se o úložiště
class Store {
    static getKnihy() {
        let knihy;
        if(localStorage.getItem('knihy') === null) {
            knihy = [];
        } else {
            knihy = JSON.parse(localStorage.getItem('knihy'));
        }

        return knihy;
    }


    //Přidání položky a seřezení podle abecedy
    static addKniha(kniha) {
        const knihy = Store.getKnihy();
        knihy.push(kniha);

        localStorage.setItem("knihy", JSON.stringify(knihy));
    }

    static getNewID() {
        let lastID;
        if(localStorage.getItem('lastID') === null) {
            lastID = 1;
            localStorage.setItem("lastID", lastID);
        } else {
            lastID = Number(localStorage.getItem('lastID')) + 1;
            localStorage.setItem("lastID", lastID);
        }
        
        return lastID;    
    }

    //Odebrání položky
    static removeKniha(id) {
        console.log(id);
        const knihy = Store.getKnihy();
        knihy.forEach((kniha, index) => {
            if(Number(kniha.id) === Number(id)) {
                knihy.splice(index, 1);
                //console.log(knihy)
            }
        });

        localStorage.setItem('knihy', JSON.stringify(knihy));
    }

    // Odebere položku z paměti, pouze pokud odsouhlasíme confirm + vypíše hlášky
    static confirmDelete(){
        if (confirm('Opravdu chcete položku odebrat?') == true) {
            document.querySelector('#kniha-list').addEventListener('click', (e) => {
     
                UI.deleteKniha(e.target);
                Store.removeKniha(e.target.parentElement.parentNode.firstElementChild.innerHTML);
                UI.showAlertDelete('Položka byla úspěšně odebrána');
            }); 
            
        } else {
            UI.showAlertDelete('Odebrání položky bylo zrušeno');
        }
    }

    
}



// Event: zobrazení položek
document.addEventListener('DOMContentLoaded', UI.displayKnihy);

// Event: Přidání položky
document.querySelector('#kniha-form').addEventListener('submit', (e) => {

    // Zabraňuje skutečnému odeslání 
    e.preventDefault();

    // Co získává z hodnot
    let autor = document.querySelector('#autor').value;
    let nazev = document.querySelector('#nazev').value;
    let zanr = Array.from(document.getElementsByName("zanr")).find(r => r.checked).value;
    let pozn = document.querySelector('#pozn').value;
    

    // Ověření + hláška
    if(autor === '' || nazev === '' || zanr === '' || pozn === '') {
        UI.showAlert('Prosím vyplňte všechny pole', 'danger');
    } else { 
        // Nový objekt položka
        const kniha = new Kniha(Store.getNewID(), autor, nazev, zanr, pozn);

        // Přidání položky do paměti
        Store.addKniha(kniha)
        
        //Refresh UI
        UI.displayKnihy()


        // Vyčištění polí
        UI.clearFields();
    }
});



