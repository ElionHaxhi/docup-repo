var appNavbar = angular.module('appNavbar', []);

appNavbar.factory('Navbar', ['Patient','LoginAuthentication', 'Agenda', function(Patient, Agenda) {
	var navbar = {
		viz: {
			dashboard: false,
			patients: true,
			logout: false
		},
		curr: 'dashboard'
	};
	
	navbar.setTabSelected = function(tabName) {
		navbar.clearAllTabSelected();
		navbar.viz[tabName] = true;
		navbar.curr = tabName;
	};
	
	navbar.clearAllTabSelected = function() {
		_.each(navbar.viz, function(elem, index) {
			navbar.viz[index] = false;
		});
	};
	
	navbar.openContextualGuide = function(guideName, stepNum) {
		if (!stepNum) {
			stepNum = 0;
		}
		if (guideName) {
			hopscotch.startTour(tours[guideName], stepNum);
		} else if (tours[navbar.curr]) {
			if (navbar.curr == 'patientdetail' && Patient.viz.write) {
				hopscotch.startTour(tours['patientform'], stepNum);
			} else if (navbar.curr == 'agenda' && Agenda.viz.write) {
				hopscotch.startTour(tours['agendaform'], stepNum);
			} else {
				hopscotch.startTour(tours[navbar.curr], stepNum);
			}
		}
	};
	
	return navbar;
}]);

var tours = {
	'dashboard': {
		id: "dashboard",
		bubbleWidth: 500,
		steps: [
			{
				title: "Menù dei Tab",
				content: "I Tab del menù in alto permettono di spostarsi tra le varie sezioni dell'applicazione:" +
					"<ul><li><strong>Home</strong>: pannello riassuntivo</li>" +
					"<li><strong>Pazienti</strong>: lista pazienti</li>" +
					"<li><strong>Paziente</strong>: scheda paziente selezionato</li>" +
					"<li><strong>Visite</strong>: lista visite del paziente selezionato</li>" +
					"<li><strong>Visita</strong>: scheda visita selezionata</li>" +
					"<li><strong>Agenda</strong>: agenda appuntamenti</li></ul>",
				target: "guide_menu_tabs",
				placement: "bottom"
			},
			{
				title: "Guide",
				content: "In ogni pagina è sempre possibile accedere a una guida contestuale come questa premendo su questo pulsante:" +
					"<ul><li><strong>Guida contestuale</strong>: si attivano le guide contestuali che spiegano brevemente le funzioni principali della pagina in cui ci si trova</li>" +
					"<li><strong>Manuale utente</strong>: è possibile accedere al manuale wiki completo del prodotto</li></ul>",
				target: "guide_menu_help",
				placement: "bottom",
				xOffset: -560,
				arrowOffset: 560,
				width: 600
			},
			{
				title: "Menù di sistema",
				content: "Questo pulsante apre un menù a tendina che permette di accedere alla impostazioni della propria utenza e dell'applicazione:" +
					"<ul><li><strong>Configura schede specialistiche</strong>: permette di scegliere le schede specialistiche usate durante l'anamnesi del paziente e come dettagli della visita</li>" +
					"<li><strong>Impostazioni applicazione</strong>: permette di personalizzare gli elementi dell'applicazione in modo da adattarla al proprio modo di lavorare</li>" +
					"<li><strong>Impostazioni calendari</strong>: per usare calendari esterni e configurare l'agenda</li>" +
					"<li><strong>My iDoctorWeb</strong>: per accedere alla pagina principale del proprio spazio iDoctorWeb e per accedere a configurazioni avanzate come tipi dato personalizzati e gestire il proprio account</li>" +
					"<li><strong>Esci</strong>: esce dall'applicazione</li></ul>",
				target: "guide_menu_settings",
				placement: "bottom",
				xOffset: -560,
				arrowOffset: 560,
				width: 600
			},
			{
				title: "Lista attività",
				content: "Questa sezione mostra i prossimi appuntamenti in agenda. E' possibile filtrare per Medico, per Studio e decidere quanti elementi massimo mostrare" +
					"<ul><li>Selezionando una data si apre il relativo appuntamento in agenda</li>" +
					"<li>Selezionando il nome del paziente (se presente) si accede alla sua scheda personale</li>" +
					"<li>Se è presente l'indicazione del paziente è possibile anche creare direttamente la visita relativa all'appuntamento</li>" +
					"<li>E' mostrato anche il tipo di visita se indicato alla creazione dell'appuntamento</li></ul>",
				target: "guide_dashboard_worklist",
				placement: "bottom",
				width: 400
			},
			{
				title: "Inizia a usare iDoctorWeb",
				content: "Per iniziare a usare l'applicazione è necessario creare il primo paziente accedendo alla lista pazienti",
				target: "guide_dashboard_start",
				placement: "right",
				width: 400
			}
		]
	},
	'patients': {
		id: "patients",
		bubbleWidth: 400,
		steps: [
			{
				title: "Crea nuovo paziente",
				content: "Premi il pulsante per creare un nuovo paziente",
				target: "guide_patients_addpatient",
				xOffset: -360,
				arrowOffset: 360,
				placement: "bottom"
			},
			{
				title: "Lista pazienti",
				content: "Premi sul nome di un paiente in lista per aprire la sua scheda dettagliata e accedere alla lista delle sue visite",
				target: "guide_patients_list",
				arrowOffset: "center",
				placement: "bottom"
			},
			{
				title: "Cerca pazienti",
				content: "Digitare le prime lettere del cognome o del nome del paziente per limitare il numero di pazienti visualizzati",
				target: "guide_patients_search",
				placement: "bottom"
			},
			{
				title: "Filtra pazienti per tipo",
				content: "Scegliere uno dei tipi paziente dalla lista per mostrare solo i pazienti del tipo selezionato",
				target: "guide_patients_filter",
				xOffset: -360,
				arrowOffset: 360,
				placement: "bottom"
			},
			{
				title: "Aggiorna pazienti",
				content: "Premere per aggiornare la lista",
				target: "guide_patients_refresh",
				xOffset: -360,
				arrowOffset: 360,
				placement: "bottom"
			}
		]
	},
	'patientdetail': {
		id: "patientdetail",
		bubbleWidth: 400,
		steps: [
			{
				title: "Sezioni dati paziente",
				content: "Dopo avere selezionato un paziente è possibile accedere a tutti i suoi dati raccolti in quattro sezioni:" +
					"<ul><li><strong>Riepilogo</strong>: raggruppa una vista sintetica del paziente, la lista degli episodi medici registrati e una visualizzazione temporale delle visite effettuate.</li>" +
					"<li><strong>Anagrafica</strong>: dati anagrafici del paziente.</li>" +
					"<li><strong>Anamnesi</strong>: anamnesi specialistica del paziente (deve essere scelta una scheda anamnestica specialistica nelle impostazioni).</li>" +
					"<li><strong>Aggiuntivi</strong>: dati anagrafici aggiuntivi.</li></ul>",
				target: "guide_patient_tabs",
				placement: "bottom"
			},
			{
				title: "Allegati paziente",
				content: "Oltre ai dati della scheda paziente è possibile allegare una serie di elementi aggiuntivi. Cliccando su questi pulsanti si apriranno le diverse sezioni:" +
					"<ul><li><strong>Prestazioni erogate</strong>: prestazioni mediche erogate al paziente scelte da un listino prestazioni (normalmente sono registrate nelle visite).</li>" +
					"<li><strong>Note</strong>: Annotazioni testuali come certificati, prescrizioni, ricette, ... Sarà possibile stampare queste annotazioni.</li>" +
					"<li><strong>File allegati</strong>: E' possibile allegare file dal proprio PC come immagini mediche, referti medici, ...</li>" +
					"<li><strong>Documenti compilabili</strong>: E' possibile stampare automaticamente documenti da far firmare al paziente, come consensi informti.</li></ul>" +
					"<li><strong>Grafici</strong>: E' possibile monitorare con l'aiuto di grafici l'andamento di alcuni valori clinici raccolti durante le visite mediche.</li></ul>",
				target: "guide_patient_attachs",
				placement: "right"
			},
			{
				title: "Modifica paziente",
				content: "Premendo questo pulsante è possibile modificare i dati del paziente",
				target: "guide_patient_update",
				arrowOffset: "center",
				xOffset: -360,
				arrowOffset: 360,
				placement: "bottom"
			},
			{
				title: "Tipo paziente",
				content: "E' possibile assegnare il paziente a una certa tipologia per poterli poi raggruppare. E' possibile impostare nuove tipologie di paziente",
				target: "guide_patient_type",
				xOffset: -360,
				arrowOffset: 360,
				placement: "bottom"
			},
			{
				title: "Stampa paziente",
				content: "Scegliere uno dei tipi paziente dalla lista per mostrare solo i pazienti del tipo selezionato",
				target: "guide_patient_print",
				xOffset: -360,
				arrowOffset: 360,
				placement: "bottom"
			},
			{
				title: "Aggiungi visita",
				content: "Un modo veloce per accedere alla pagina di inserimento nuova visita per il paziente selezionato",
				target: "guide_patient_addexam",
				xOffset: -360,
				arrowOffset: 360,
				placement: "bottom"
			}
		]
	},
	'patientform': {
		id: "patientform",
		bubbleWidth: 400,
		steps: [
			{
				title: "Sezioni dati paziente",
				content: "I dati del paziente sono divisi in tre sezioni:" +
					"<ul><li><strong>Anagrafica</strong>: dati anagrafici del paziente.</li>" +
					"<li><strong>Anamnesi</strong>: anamnesi specialistica del paziente (deve essere scelta una scheda anamnestica specialistica nelle impostazioni).</li>" +
					"<li><strong>Aggiuntivi</strong>: dati anagrafici aggiuntivi.</li></ul>",
				target: "guide_patient_tabs",
				placement: "bottom"
			},
			{
				title: "Salva paziente",
				content: "Premendo questo pulsante è possibile salvare i nuovi dati inseriti",
				target: "guide_patient_save",
				arrowOffset: "center",
				xOffset: -360,
				arrowOffset: 360,
				placement: "bottom"
			},
			{
				title: "Annulla inserimento",
				content: "Premendo questo pulsante si annulla l'insirimento dei dati",
				target: "guide_patient_back",
				xOffset: -360,
				arrowOffset: 360,
				placement: "bottom"
			}
		]
	},
	'avaservices': {
		id: "avaservices",
		bubbleWidth: 500,
		steps: [
			{
				title: "Listino prestazioni mediche",
				content: "<p>Il listino delle prestazioni permette di definire le prestazioni mediche che erogate nel vostro studio medico ed assegnarle a singoli pazienti o visite in modo da sapere sempre quali prestazioni sono state erogate.</p>" +
					'<p>Per iniziare a usare il listino delle prestazioni creare la prima prestazione medica premendo qui sopra il pulsante.</p>' +
					'<p><a href="" class="btn btn-success"><span class="glyphicon glyphicon-plus"></span> Prestazione</a></p>' +
					'<p><div class="media"><div class="pull-left"><a href="" class="btn btn-primary"><span class="glyphicon glyphicon-share-alt"></span></a></div><div class="media-body">Una volta create delle prestazioni mediche a listino sarà possibile assegnarle a pazienti o visite premendo questo pulsante.</div></div></p>' +		
					'<p><div class="media"><div class="pull-left"><a href="" class="btn btn-default"><span class="glyphicon glyphicon-pencil"></span></a></div><div class="media-body">Questo pulsante permette invece di modificare una prestazine a listino.</div></div></p>',
				target: "guide_avaservice_table",
				placement: "bottom"
			},
			{
				title: "Prestazioni assegnate",
				content: "<p>Le prestazioni assegnate si riferiscono al paziente o alla visita corrente e servono per tenere traccia delle prestazioni erogate.</p>" +
					'<p>Per confermare che una prestazione è stata pagata dal paziente correntemente selezionato si deve premere</p>' +
					'<p><button class="btn btn-success"><span class="glyphicon glyphicon-plus"></span> Pagato</button></p>' +
					'<p><div class="media"><div class="pull-left"><a href="" class="btn btn-default"><span class="glyphicon glyphicon-trash"></span></a></div><div class="media-body">Permette di rimuovere la prestazione da quelle selezionate per il paziente o la visita corrente.</div></div></p>' +		
					'<p><div class="media"><div class="pull-left"><a href="" class="btn btn-default"><span class="glyphicon glyphicon-pencil"></span></a></div><div class="media-body">Permette di modificare i dettagli della singola prestazione assegnata (ad esempio per modificarne il prezzo)</div></div></p>',
				target: "guide_service_table",
				xOffset: -250,
				arrowOffset: 250,
				placement: "bottom"
			}
		]
	},
	'agenda': {
		id: "agenda",
		bubbleWidth: 400,
		steps: [
			{
				title: "Calendario",
				content: "<p>Il calendario principale permette di visualizzare gli appuntamenti in viste mensili, settimanali o giornaliere</p>" +
					"<p>Cliccando su un appuntamento si accede ai dettagli ed è possibile applicare modifiche. E' possibile trascinare un appuntamento in una giornata od orario diverso oppure trasciando il lato basso di uno slot è possibile modificare la durata.</p>" +
					"<p>Cliccando su uno slot libero in agenda è possibile creare una visita alla data e orario indicato. Ogni click successivo andrà ad aggiornare la data e l'ora della visita che si sta editando</p>",
				target: "guide_agenda_calendar",
				placement: "top",
				xOffset: "center",
				yOffset: "center"
			},
			{
				title: "Navigazione rapida calendario",
				content: "Per passare rapidamente ad un giorno, una settimana o un mese diverso è possibile cliccare su un giorno di questo calendarietto",
				target: "guide_agenda_smallcal",
				placement: "right"
			},
			{
				title: "Nuovo appuntamento",
				content: "Premendo questo pulsante è possibile inserire un nuovo appuntamento in agenda",
				target: "guide_agenda_addappoint",
				placement: "bottom"
			},
			{
				title: "Aggiorna calendario",
				content: "Premendo questo pulsante i dati del calendario vengono aggiornati",
				target: "guide_agenda_refresh",
				placement: "bottom"
			},
			{
				title: "Lista pazienti",
				content: "Sono visualizzati i pazienti e cliccando su uno di essi è possibile creare un appuntamento assegnato ad esso.",
				target: "guide_agenda_tabpatients",
				placement: "top"
			},
			{
				title: "Filtra per medico",
				content: "Selezionando medici dalla lista saranno visualizzate in calendario solo gli appuntamenti relativi a loro.",
				target: "guide_agenda_tabdoctors",
				placement: "top"
			},
			{
				title: "Filtra per studio",
				content: "Selezionando studi dalla lista saranno visualizzate in calendario solo gli appuntamenti presso gli studi selezionati.",
				target: "guide_agenda_tabstudios",
				placement: "top"
			},
			{
				title: "Filtra per tipo appuntamento",
				content: "Selezionando tipo appuntamento saranno visualizzate in calendario solo gli appuntamenti di quel tipo.",
				target: "guide_agenda_tabtypes",
				placement: "top"
			}
		]
	},
	'agendaform': {
		id: "agendaform",
		bubbleWidth: 400,
		steps: [
			{
				title: "Selezione/inserimento paziente",
				content: "<p>Digitando le prime lettere del cognome del paziente apparirà una lista da cui poter scegliere un elemento per associare il paziente all'appuntamento</p>" + 
					"<p>Dopo aver selezionato un paziente non è possibile modificare cognome o nome prima di averlo disassociato con l'apposito pulsante di cancellazione comparso affianco al cognome</p>" + 
					"<p> Nel caso in cui invece il paziente non sia in lista digitando cognome e nome sarà creato automaticamente appena confermato l'appuntamento</p>",
				target: "guide_agenda_surname",
				placement: "right"
			},
			{
				title: "Durata, data e orario appuntamento",
				content: "Devono essere impostate la durata, la data e l'orario dell'appuntamento. E' possibile cliccare su uno slot libero del calendario per poter impostare velocemente la data e l'orario.",
				target: "guide_agenda_duration",
				placement: "right"
			},
			{
				title: "Salva appuntamento",
				content: "Una volta impostati tutti i dati dell'appuntamento è possibile salvare con questo pulsante",
				target: "guide_agenda_save",
				placement: "bottom"
			},
			{
				title: "Pulisci form",
				content: "Se invece si vuole pulire il form di inserimento dai dati presenti per ricompilare dall'inizio usare questo pulsante.",
				target: "guide_agenda_null",
				placement: "bottom"
			},
			{
				title: "Chiudi form",
				content: "Questo pulsante permette di chiudere il form di inserimento/modifica appuntamento.",
				target: "guide_agenda_back",
				placement: "bottom"
			},
			{
				title: "Cancella appuntamento",
				content: "Se si è selezionato un appuntamento dal calendario sarà abilitato questo pulsante per la sua cancellazione.",
				target: "guide_agenda_delete",
				placement: "bottom"
			}
		]
	}
};
