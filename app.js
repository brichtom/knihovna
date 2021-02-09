


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
    static displayKnihy(filtr = "autor") {
        const list = document.querySelector('#kniha-list');
        filtr = document.getElementById("filtr").value;
        
        while (list.firstChild) {
            list.firstChild.remove();
        }

        const knihy = Store.getKnihy();
        UI.sortKnihy(knihy, filtr);
        
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

    static sortKnihy(knihy, filtr) {
        switch(filtr) {
            case "autor":
                knihy.sort(function(a, b){
                    if(a.autor < b.autor) { return -1; }
                    if(a.autor > b.autor) { return 1; }
                    return 0;
                })
                break;
            case "nazev":
                knihy.sort(function(a, b){
                    if(a.nazev < b.nazev) { return -1; }
                    if(a.nazev > b.nazev) { return 1; }
                    return 0;
                })
                break;
            case "zanr":
                knihy.sort(function(a, b){
                    if(a.zanr < b.zanr) { return -1; }
                    if(a.zanr > b.zanr) { return 1; }
                    return 0;
                })
                break;
        }
    }


    //Přidání položky do listu
    static addKnihaToList(list, kniha) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><input type="checkbox" class="form-check-input"></td>
            <td>${kniha.id}</td>
            <td class="editable" contenteditable>${kniha.autor}</td>
            <td class="editable" contenteditable>${kniha.nazev}</td>
            <td class="editable" contenteditable>${kniha.zanr}</td>
            <td class="editable" contenteditable>${kniha.pozn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete" onclick="Store.confirmDelete()"><span class="glyphicon">&#xe014;</span></a></td>
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

    static editKniha(id, data) {
       Store.removeKniha(id);
       Store.addKniha(data);
    }

    // Odebere položku z paměti, pouze pokud odsouhlasíme confirm + vypíše hlášky
    static confirmDelete(){
        if (confirm('Opravdu chcete položku odebrat?') == true) {
            document.querySelector('#kniha-list').addEventListener('click', (e) => {
     
                UI.deleteKniha(e.target);
                Store.removeKniha(e.target.parentElement.parentNode.children[1].innerText);
            }); 
        }
    }

    static exportToCSV(items = Store.getKnihy(), filename = "Seznam knih.csv") {
        if(items && items.length) {
            const replacer = (key, value) => value === null ? '' : value;
            const header = Object.keys(items[0]);
            const csv = [
            header.join(','), // header row first
            ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
            ].join('\r\n');

            let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
            //console.log(csv);
        } else {
            alert("Není co exportovat!");
        }
    }

    static exportOnlySelToCSV() {
        let toExportSelected = Array.from(document.querySelector('#kniha-list').children);
        let toExport = [];
        let knihy = Store.getKnihy();
        toExportSelected.forEach((el) => {
            if(el.children[0].firstChild.checked) {
                knihy.forEach((kniha) => {
                    if(Number(kniha.id) === Number(el.children[1].innerText))
                        toExport.push(kniha);
                });
            }
        });

        Store.exportToCSV(toExport);
    }
}



if(document.querySelector('#kniha-form') === null) {
    // Event: zobrazení položek
    document.addEventListener('DOMContentLoaded', UI.displayKnihy);

    // Event: editace položek
    document.querySelector('#kniha-list').addEventListener('focusout', e => {
        if (e.target.className === 'editable') {
            let kDataArr = e.target.parentElement.children;
            let id = Number(kDataArr[1].innerText);
            let kniha = new Kniha(id, kDataArr[2].innerText, kDataArr[3].innerText, kDataArr[4].innerText, kDataArr[5].innerText);
            
            Store.editKniha(id, kniha);
            UI.displayKnihy();
        }
    })

     // Event: zmena filtru
    document.querySelector('#filtr').addEventListener('change', function() {
        UI.displayKnihy(this.value);
    })
} else {
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
}







