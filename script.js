  // Definizione dei prezzi
	const prezziMezzi = {
	  "Pedalò piccolo": { "30": 10, "60": 15, "120": 30 },
	  "Pedalò grande": { "30": 15, "60": 20, "120": 40 },
	  "Pedalò elettrico": { "30": 20, "60": 30, "120": 60 },
	  "SUP": { "30": 7, "60": 13, "120": 25 },
	  "Kayak": { "30": 9, "60": 17, "120": 34 }
	};
	
  // Mappa dei mezzi e numeri corrispondenti
  const mezziDisponibiliPerTipo = {
    "Pedalò piccolo": [1, 2, 3, 4, 5],
    "Pedalò grande": [6, 7, 8, 9, 10],
    "Pedalò elettrico": [11, 12, 13, 14, 15],
    "SUP": [16, 17, 18, 19, 20],
    "Kayak": [21, 22, 23, 24, 25]
  };

  // Funzione per ottenere i numeri disponibili (escludendo quelli già prenotati)
  function getMezziDisponibili(mezzo) {
    const prenotazioni = JSON.parse(localStorage.getItem('prenotazioni')) || [];
    const mezziPrenotati = prenotazioni.filter(p => p.mezzo === mezzo && !p.rientrato); // Mezzi prenotati che non sono ancora rientrati

    // Otteniamo tutti i numeri disponibili per il tipo selezionato
    const mezziTotali = mezziDisponibiliPerTipo[mezzo];

    // Filtriamo i numeri dei mezzi prenotati
    return mezziTotali.filter(numero => !mezziPrenotati.some(p => p.numero === numero));
  }

  // Carica i numeri dei mezzi disponibili quando si seleziona un tipo
  document.getElementById("mezzo").addEventListener("change", function () {
    const tipoSelezionato = this.value;
    const selectNumero = document.getElementById("numeroMezzo");

    // Svuota la select
    selectNumero.innerHTML = "";

    // Se è stato selezionato un tipo valido, mostra i numeri corrispondenti
    if (mezziDisponibiliPerTipo[tipoSelezionato]) {
      const numeri = getMezziDisponibili(tipoSelezionato);
      // Aggiungi una nuova opzione per i mezzi disponibili
      if (numeri.length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "Nessun mezzo disponibile";
        selectNumero.appendChild(opt);
      } else {
        numeri.forEach(num => {
          const opt = document.createElement("option");
          opt.value = num;
          opt.textContent = `Mezzo #${num}`;
          selectNumero.appendChild(opt);
        });
      }
    } else {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Seleziona un tipo di mezzo";
      selectNumero.appendChild(opt);
    }
  });

  // Funzione per salvare una prenotazione
  function salvaPrenotazione(nome, cognome, mezzo, numero, data, durata, cassa, documento, prezzo) {
    const prenotazioni = JSON.parse(localStorage.getItem('prenotazioni')) || [];
    const nuovaPrenotazione = {
      nome,
      cognome,
      mezzo,
      numero,
      data,
      durata,
      cassa,
      documento,
      prezzo,
      rientrato: false // Rientrato sarà impostato su false quando una prenotazione è creata
    };
    prenotazioni.push(nuovaPrenotazione);
    localStorage.setItem('prenotazioni', JSON.stringify(prenotazioni));
  }
  

  // Funzione per caricare le prenotazioni attive nella tabella
	function caricaPrenotazioniAttive() {
	  const prenotazioni = JSON.parse(localStorage.getItem('prenotazioni')) || [];
	  const tabella = document.getElementById('tabellaPrenotazioni').getElementsByTagName('tbody')[0];

	  // Svuota la tabella
	  tabella.innerHTML = "";

	  prenotazioni.forEach((p, index) => {
		if (!p.rientrato) { // Solo prenotazioni attive
		  const row = tabella.insertRow();
		  row.innerHTML = `
			<td>${p.nome} ${p.cognome}</td>
			<td>${p.mezzo}</td>
			<td>${p.numero}</td>
			<td>${new Date(p.data).toLocaleString()}</td>
			<td>${p.durata} minuti</td>
			<td>${p.cassa ? 'Sì' : 'No'}</td>
			<td>${p.documento ? 'Sì' : 'No'}</td> <!-- Mostra se il documento è richiesto -->
			<td>${p.prezzo}€</td>
			<td>
			  <button class="btn btn-success" onclick="segnalaRientro(${index})">Segna come Rientrato</button>
			  <button class="btn btn-danger" onclick="eliminaPrenotazione(${index})">Elimina</button>
			</td>
		  `;
		}
	  });
	}



  // Funzione per caricare le prenotazioni rientrate nella seconda tabella
	function caricaPrenotazioniRientrate() {
	  const prenotazioni = JSON.parse(localStorage.getItem('prenotazioni')) || [];
	  const tabellaRientrate = document.getElementById('tabellaPrenotazioniRientrate').getElementsByTagName('tbody')[0];

	  // Svuota la tabella
	  tabellaRientrate.innerHTML = "";

	  prenotazioni.forEach((p, index) => {
		if (p.rientrato) { // Solo prenotazioni rientrate
		  const row = tabellaRientrate.insertRow();
		  row.innerHTML = `
			<td>${p.nome} ${p.cognome}</td>
			<td>${p.mezzo}</td>
			<td>${p.numero}</td>
			<td>${new Date(p.data).toLocaleString()}</td>
			<td>${p.durata} minuti</td>
			<td>${p.cassa ? 'Sì' : 'No'}</td>
			<td>${p.documento ? 'Sì' : 'No'}</td> <!-- Mostra se il documento è richiesto -->
			<td>${p.prezzo}€</td>
			<td>
			  <button class="btn btn-danger" onclick="eliminaPrenotazione(${index})">Elimina</button>
			</td>
		  `;
		}
	  });
	}


  // Funzione per segnare una prenotazione come "rientrato" e spostarla nella tabella delle prenotazioni rientrate
	function segnalaRientro(index) {
		const prenotazioni = JSON.parse(localStorage.getItem('prenotazioni')) || [];
		prenotazioni[index].rientrato = true; // Modifica il flag "rientrato"
		localStorage.setItem('prenotazioni', JSON.stringify(prenotazioni));

		// Ricarica le due tabelle (attive e rientrate)
		caricaPrenotazioniAttive();
		caricaPrenotazioniRientrate();
	}

  // Funzione per eliminare una prenotazione
  function eliminaPrenotazione(index) {
    const prenotazioni = JSON.parse(localStorage.getItem('prenotazioni')) || [];
    prenotazioni.splice(index, 1); // Rimuovi la prenotazione selezionata
    localStorage.setItem('prenotazioni', JSON.stringify(prenotazioni));

    // Ricarica le due tabelle (attive e rientrate)
    caricaPrenotazioniAttive();
    caricaPrenotazioniRientrate();
  }

	// Funzione per aggiungere una prenotazione
	function aggiungiPrenotazione(nome, cognome, mezzo, numero, data, durata, cassa, documento) {
	  // Calcola il prezzo base in base al mezzo e alla durata
	  const prezzoBase = prezziMezzi[mezzo] ? prezziMezzi[mezzo][durata] : 0;
	  
	  // Aggiungi il supplemento per la cassa Bluetooth se selezionato
	  const prezzoTotale = prezzoBase + (cassa ? 5 : 0); // Aggiungi 5€ se la cassa è selezionata

	  // Salva la prenotazione
	  const prenotazioni = JSON.parse(localStorage.getItem('prenotazioni')) || [];
	  const nuovaPrenotazione = {
		nome,
		cognome,
		mezzo,
		numero,
		data,
		durata,
		cassa,
		documento,  // Salva anche se il documento è richiesto
		prezzo: prezzoTotale,  // Salva il prezzo totale
		rientrato: false
	  };
	  
	  prenotazioni.push(nuovaPrenotazione);
	  localStorage.setItem('prenotazioni', JSON.stringify(prenotazioni));

	  // Ricarica le tabelle dopo l'aggiunta della prenotazione
	  caricaPrenotazioniAttive();
	  caricaPrenotazioniRientrate();

	  // Reset del form
	  document.getElementById('noleggioForm').reset();  // Reset del form
	  document.getElementById('prezzo').innerText = "0€";  // Ripristina il campo del prezzo a 0€
	}


  // Eseguiamo il caricamento delle prenotazioni attive e rientrate quando la pagina è pronta
  window.onload = function() {
  // Precompila la data con l'ora corrente
  const dataCorrente = new Date();
  const dataISO = dataCorrente.toISOString().slice(0, 16);  // Formato YYYY-MM-DDTHH:mm
  document.getElementById('data').value = dataISO;

  // Carica le prenotazioni attive e rientrate
  caricaPrenotazioniAttive();
  caricaPrenotazioniRientrate();
  
  // Calcola e aggiorna il prezzo quando la pagina viene caricata
  calcolaPrezzo();
};


// Funzione per calcolare e visualizzare il prezzo in base alla durata selezionata
document.getElementById('mezzo').addEventListener('change', function() {
  calcolaPrezzo();
});

document.getElementById('durata').addEventListener('change', function() {
  calcolaPrezzo();
});

// Aggiungi l'evento per la cassa Bluetooth
document.getElementById('cassa').addEventListener('change', function() {
  calcolaPrezzo();  // Ricalcola il prezzo ogni volta che cambia lo stato della checkbox
});

function calcolaPrezzo() {
  const mezzoSelezionato = document.getElementById('mezzo').value;
  const durataSelezionata = document.getElementById('durata').value;
  const cassaBluetooth = document.getElementById('cassa').checked ? 5 : 0;  // Aggiungi 5€ se la cassa è selezionata

  // Verifica che il mezzo e la durata siano selezionati
  if (mezzoSelezionato && durataSelezionata) {
    const prezzoBase = prezziMezzi[mezzoSelezionato] ? prezziMezzi[mezzoSelezionato][durataSelezionata] : 0;
    const prezzoTotale = prezzoBase + cassaBluetooth; // Calcola il prezzo totale

    // Visualizza il prezzo nel campo "prezzo"
    document.getElementById('prezzo').innerText = `${prezzoTotale}€`;  // Usa innerText per un <span>
  }
}

// Funzione per esportare tutte le prenotazioni in formato CSV
function esportaPrenotazioni() {
  const prenotazioni = JSON.parse(localStorage.getItem('prenotazioni')) || [];

  // Aggiungiamo l'intestazione delle colonne
  const intestazione = ["Cliente", "Mezzo", "Numero", "Data", "Ora", "Durata", "Cassa", "Documento", "Prezzo"];
  
  // Mappiamo le prenotazioni in formato CSV
  const righe = prenotazioni.map(p => {
    const data = new Date(p.data);
    const dataFormato = data.toLocaleDateString();  // Estrae solo la data
    const oraFormato = data.toLocaleTimeString();   // Estrae solo l'ora

    return [
      `${p.nome} ${p.cognome}`,
      p.mezzo,
      p.numero,
      dataFormato,  // Data in una colonna
      oraFormato,   // Ora in un'altra colonna
      `${p.durata} minuti`,
      p.cassa ? 'Sì' : 'No',
      p.documento ? 'Sì' : 'No',
      `${p.prezzo}€`
    ];
  });

  // Aggiungiamo l'intestazione come prima riga
  righe.unshift(intestazione);

  // Convertiamo le righe in una stringa CSV
  const csvContent = "data:text/csv;charset=utf-8," 
    + righe.map(row => row.join(",")).join("\n");

  // Creiamo un link per il download del CSV
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "prenotazioni.csv");
  document.body.appendChild(link);

  // Simula il click per scaricare il file CSV
  link.click();
}



// Funzione per cancellare tutte le prenotazioni
function cancellaTutto() {
  // Rimuoviamo tutte le prenotazioni dal localStorage
  localStorage.removeItem('prenotazioni');
  
  // Ricarica le tabelle per riflettere i cambiamenti
  caricaPrenotazioniAttive();
  caricaPrenotazioniRientrate();
}