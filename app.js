
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

    //seřazení podle abecedy
        const knihy = Store.getKnihy();
        knihy.sort(function(a, b){
            if(a.autor < b.autor) { return -1; }
            if(a.autor > b.autor) { return 1; }
            return 0;
        })

        knihy.forEach((kniha) => UI.addKnihaToList(list, kniha));
    }

    //horní okraj stránky
    static myFunction() {
        const x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    }

    //zobrazení knih
    static displaySelectedKnihy(knihaName) {
        const list = document.querySelector('#knihaOb-list');
        
        while (list.firstChild) {
            list.firstChild.remove();
        }

    //seřazení podle abecedy
        const knihy = Store.getSelectedKnihy(knihaName);
        knihy.sort(function(a, b){
            if(a.nazev < b.nazev) { return -1; }
            if(a.nazev > b.nazev) { return 1; }
            return 0;
        })
        
        knihy.forEach((kniha) => UI.addKnihaToList2(list, kniha));
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

    //Přidání položky do listu
    static addKnihaToList2(list, kniha) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${kniha.id}</td>
            <td>${kniha.autor}</td>
            <td>${kniha.nazev}</td>
            <td>${kniha.zanr}</td>
            <td>${kniha.pozn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete" onclick="Store.confirmDelete2()">X</a></td>
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


