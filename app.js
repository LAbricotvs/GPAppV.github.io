document.addEventListener('DOMContentLoaded', () => {
    const controls = [
        { description: "Nettoyage châssis moteur, n° moteur et n° de châssis", allowNotEquipped: false },
        { description: "Contrôle de la batterie et batterie auxiliaire (fixation,âge)", allowNotEquipped: false },
        { description: "Contrôle du carnet antipollution, permis de circulation, n° châssis et n° moteur", allowNotEquipped: false },
        { description: "Oter vignettes et autocollants + objets pendus au rétroviseur intérieur", allowNotEquipped: false },
        { description: "Contrôler peinture des plaques d’immatriculation (système interchang.)", allowNotEquipped: false },
        { description: "Contrôler homologation des jantes + fiche ASA", allowNotEquipped: false },
        { description: "Contrôler le MultiMedia (radio, navigation, haut-parleurs)", allowNotEquipped: false },
        { description: "Contrôles sous véhicule (perforation, rouille, échappement)", allowNotEquipped: false },
        { description: "Contrôle des fuites (moteur, transmission, freins, carburant, refroidissement,direction)", allowNotEquipped: false },
        { description: "Contrôle suspension", allowNotEquipped: false },
        { description: "Contrôle des pneumatiques (usure + état général)", allowNotEquipped: false },
        { description: "Contrôle du système de freinage, du répartiteur, du frein à main et des flexibles de freins (disques et Plaquette)", allowNotEquipped: false },
        { description: "Contrôle supports moteur, boîte de vitesses, pont arrière et arbre de transmission", allowNotEquipped: false },
        { description: "Contrôle des balais essuie-glaces et du lave-glace + lave-phares", allowNotEquipped: false },
        { description: "Contrôle éclairage et klaxon", allowNotEquipped: false },
        { description: "Contrôle des protections de pédales", allowNotEquipped: false },
        { description: "Contrôle des ceintures de sécurité + sièges + caoutchouc pédale", allowNotEquipped: false },
        { description: "Réglage des phares", allowNotEquipped: false },
        { description: "Contrôle géométrie au ripomètre, contrôle du blocage de direction (antivol)", allowNotEquipped: false },
        { description: "Contrôle du verrouillage centralisé, des télécommandes", allowNotEquipped: false },
        { description: "Contrôle mémoire des défauts", allowNotEquipped: false },
        { description: "Contrôle de la climatisation (froid) et du chauffage (chaud)", allowNotEquipped: false },
        { description: "Contrôle des dernières dates de service entretien, distribution et d'expertise", allowNotEquipped: false },
        { description: "Camper : contrôle toit ouvrant, date système de gaz, état frigo et cuisine et placard", allowNotEquipped: true },
        { description: "Contrôle émission de particules Diesel (à partir de B5B)", allowNotEquipped: true },
        { description: "Contrôle carrosserie+vitrage (rouille, fixation des moulures, impact pare-brise, grêle)", allowNotEquipped: false },
        { description: "Essai du véhicule, divers", allowNotEquipped: false },
    ];

    const controlList = document.getElementById('controls-list');
    
    // Remplir automatiquement la date et l'heure du contrôle
    const dateTimeInput = document.getElementById('date-time');
    const now = new Date();
    dateTimeInput.value = now.toLocaleString();

    controls.forEach(control => {
        addControl(control.description, control.allowNotEquipped);
    });

    document.getElementById('generate-pdf').addEventListener('click', () => {
        if (validateForm()) {
            generatePDF();
        } else {
            alert('Veuillez remplir tous les champs obligatoires et sélectionner OK/Non OK/Non équipé pour chaque contrôle.');
        }
    });
});

function addControl(description, allowNotEquipped) {
    const controlList = document.getElementById('controls-list');

    const controlItem = document.createElement('div');
    controlItem.classList.add('control-item');

    const controlText = document.createElement('span');
    controlText.textContent = description;

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.classList.add('ok');
    okButton.addEventListener('click', () => setControlStatus(controlItem, 'OK'));

    const notOkButton = document.createElement('button');
    notOkButton.textContent = 'Non OK';
    notOkButton.classList.add('not-ok');
    notOkButton.addEventListener('click', () => setControlStatus(controlItem, 'Non OK'));

    controlItem.appendChild(controlText);
    controlItem.appendChild(okButton);
    controlItem.appendChild(notOkButton);

    if (allowNotEquipped) {
        const notEquippedButton = document.createElement('button');
        notEquippedButton.textContent = 'Non équipé';
        notEquippedButton.classList.add('not-equipped');
        notEquippedButton.addEventListener('click', () => setControlStatus(controlItem, 'Non équipé'));
        controlItem.appendChild(notEquippedButton);
    }

    // Ajouter les champs de saisie pour la dimension des pneus si la description correspond
    if (description.includes('pneumatiques')) {
        const tireDimensions = document.createElement('div');
        tireDimensions.classList.add('tire-dimensions');

        const typeSelect = document.createElement('select'); // Type de pneus
        typeSelect.classList.add('tire-type');

        const options = ['Été', 'Hiver', '4 Saisons'];
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            typeSelect.appendChild(optionElement);
        });

        const widthInput = document.createElement('input');
        widthInput.setAttribute('type', 'text');
        widthInput.setAttribute('placeholder', 'Largeur');
        widthInput.classList.add('tire-width');

        const aspectRatioInput = document.createElement('input');
        aspectRatioInput.setAttribute('type', 'text');
        aspectRatioInput.setAttribute('placeholder', 'Taille');
        aspectRatioInput.classList.add('tire-aspect-ratio');

        const diameterInput = document.createElement('input');
        diameterInput.setAttribute('type', 'text');
        diameterInput.setAttribute('placeholder', 'Diamètre');
        diameterInput.classList.add('tire-diameter');

        const loadIndexInput = document.createElement('input');
        loadIndexInput.setAttribute('type', 'text');
        loadIndexInput.setAttribute('placeholder', 'Indices');
        loadIndexInput.classList.add('tire-load-index');

        tireDimensions.appendChild(typeSelect); // Ajoutez le menu déroulant pour le type de pneus
        tireDimensions.appendChild(widthInput);
        tireDimensions.appendChild(aspectRatioInput);
        tireDimensions.appendChild(diameterInput);
        tireDimensions.appendChild(loadIndexInput);

        controlItem.appendChild(tireDimensions);

        // Ajouter la checkbox pour le 2ème jeu de roues
        const secondSetLabel = document.createElement('label');
        secondSetLabel.textContent = '2ème jeu de roues';
        const secondSetCheckbox = document.createElement('input');
        secondSetCheckbox.setAttribute('type', 'checkbox');
        secondSetCheckbox.classList.add('second-set-checkbox');
        secondSetLabel.prepend(secondSetCheckbox);

        controlItem.appendChild(secondSetLabel);

        // Dimension deuxième jeu de roues
        const tireDimensions2 = document.createElement('div');
        tireDimensions2.classList.add('tire-dimensions2');
        tireDimensions2.style.display = 'none'; // Masqué par défaut

        const typeSelect2 = document.createElement('select');
        typeSelect2.classList.add('tire-type2');

        const options2 = ['Été', 'Hiver', '4 Saisons'];
        options2.forEach(option2 => {
            const optionElement = document.createElement('option');
            optionElement.value = option2;
            optionElement.textContent = option2;
            typeSelect2.appendChild(optionElement);
        });

        tireDimensions2.appendChild(typeSelect2); 

        const widthInput2 = document.createElement('input');
        widthInput2.setAttribute('type', 'text');
        widthInput2.setAttribute('placeholder', 'Largeur');
        widthInput2.classList.add('tire-width2');

        const aspectRatioInput2 = document.createElement('input');
        aspectRatioInput2.setAttribute('type', 'text');
        aspectRatioInput2.setAttribute('placeholder', 'Taille');
        aspectRatioInput2.classList.add('tire-aspect-ratio2');

        const diameterInput2 = document.createElement('input');
        diameterInput2.setAttribute('type', 'text');
        diameterInput2.setAttribute('placeholder', 'Diamètre');
        diameterInput2.classList.add('tire-diameter2');

        const loadIndexInput2 = document.createElement('input');
        loadIndexInput2.setAttribute('type', 'text');
        loadIndexInput2.setAttribute('placeholder', 'Indices');
        loadIndexInput2.classList.add('tire-load-index2');

        tireDimensions2.appendChild(widthInput2);
        tireDimensions2.appendChild(aspectRatioInput2);
        tireDimensions2.appendChild(diameterInput2);
        tireDimensions2.appendChild(loadIndexInput2);

        controlItem.appendChild(tireDimensions2);

        // Ajouter l'événement pour afficher/masquer le deuxième jeu de roues
        secondSetCheckbox.addEventListener('change', (event) => {
        if (event.target.checked) {
            tireDimensions2.style.display = 'block';
        } else {
            tireDimensions2.style.display = 'none';
        }
    });
    }

    // Ajouter les champs de saisie pour les dates de service et les kilomètres si la description correspond
if (description.includes("dernières dates de service entretien")) {
    const serviceDateLabel = document.createElement('label');
    serviceDateLabel.textContent = 'Date du dernier service:';
    const serviceDateInput = document.createElement('input');
    serviceDateInput.setAttribute('type', 'date');
    serviceDateInput.classList.add('service-date');

    const mileageLabel = document.createElement('label');
    mileageLabel.textContent = 'Kilomètres du dernier service:';
    const mileageInput = document.createElement('input');
    mileageInput.setAttribute('type', 'number');
    mileageInput.setAttribute('placeholder', 'Kilomètres');
    mileageInput.classList.add('mileage');

    const expertiseDateLabel = document.createElement('label');
    expertiseDateLabel.textContent = 'Date de la dernière expertise:';
    const expertiseDateInput = document.createElement('input');
    expertiseDateInput.setAttribute('type', 'date');
    expertiseDateInput.classList.add('expertise-date');

    // Ajouter un retour à la ligne entre les groupes de champs de saisie
    controlItem.appendChild(document.createElement('br')); // Ajouter un retour à la ligne
    controlItem.appendChild(serviceDateLabel);
    controlItem.appendChild(serviceDateInput);
    controlItem.appendChild(mileageLabel);
    controlItem.appendChild(mileageInput);
    controlItem.appendChild(document.createElement('br')); // Ajouter un retour à la ligne
    controlItem.appendChild(expertiseDateLabel);
    controlItem.appendChild(expertiseDateInput);

    // Ajouter les cases à cocher
    const testsGroup = document.createElement('div');
    testsGroup.classList.add('tests-group');

    const tests = [
        'Vidange',
        'DSG',
        'Haldex',
        'Distrib',
        'Bougies',
        'Liquide de frein',
        'Filtre à carburant'
    ];

    tests.forEach(test => {
        const testLabel = document.createElement('label');
        testLabel.textContent = test;
        const testCheckbox = document.createElement('input');
        testCheckbox.setAttribute('type', 'checkbox');
        testCheckbox.classList.add('test-checkbox');
        testLabel.insertBefore(testCheckbox, testLabel.firstChild);
        testsGroup.appendChild(testLabel);
        testsGroup.appendChild(document.createElement('br'));
    });

    controlItem.appendChild(testsGroup); // Ajouter les cases à cocher au controlItem
}
        
    const commentTextarea = document.createElement('textarea');
    commentTextarea.setAttribute('placeholder', 'Ajouter un commentaire');
    commentTextarea.addEventListener('input', () => autoResize(commentTextarea));

    const photoInput = document.createElement('input');
    photoInput.setAttribute('type', 'file');
    photoInput.setAttribute('accept', 'image/*');
    photoInput.setAttribute('capture', 'environment');
    photoInput.setAttribute('multiple', true); // Permettre la sélection de plusieurs fichiers
    photoInput.addEventListener('change', (event) => handlePhotoUpload(event, controlItem));

    controlItem.appendChild(commentTextarea);
    controlItem.appendChild(photoInput);
    controlList.appendChild(controlItem);
}

function setControlStatus(controlItem, status) {
    const okButton = controlItem.querySelector('button.ok');
    const notOkButton = controlItem.querySelector('button.not-ok');
    const notEquippedButton = controlItem.querySelector('button.not-equipped');
    
    // Retirer la classe 'selected' de tous les boutons
    okButton.classList.remove('selected');
    notOkButton.classList.remove('selected');
    if (notEquippedButton) {
        notEquippedButton.classList.remove('selected');
    }
    
    // Ajouter la classe 'selected' au bouton sélectionné
    if (status === 'OK') {
        okButton.classList.add('selected');
    } else if (status === 'Non OK') {
        notOkButton.classList.add('selected');
    } else if (status === 'Non équipé' && notEquippedButton) {
        notEquippedButton.classList.add('selected');
    }
    
    controlItem.setAttribute('data-status', status);
}

function validateForm() {
    // Vérifier que tous les champs obligatoires sont remplis
    const requiredFields = [
        'control-type', // Ajouter la validation pour le type de contrôle
        'order-number',
        'chassis-number', // Ajouter la validation pour N° Chassis
        'registration',
        'mechanic',
        'vehicle',
        'mileage'
    ];
    for (let fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            return false;
        }
    }

    // Vérifier que chaque contrôle a une sélection
    const controls = document.querySelectorAll('.control-item');
    for (let control of controls) {
        if (!control.getAttribute('data-status')) {
            return false;
        }
    }

    return true;
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

function handlePhotoUpload(event, controlItem) {
    const files = event.target.files;
    const existingPhotos = JSON.parse(controlItem.getAttribute('data-photos') || '[]');
    
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            existingPhotos.push({ data: e.target.result, width: 100, height: 100 });
            controlItem.setAttribute('data-photos', JSON.stringify(existingPhotos));
        };
        reader.readAsDataURL(file);
    }
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function getStatusColor(status) {
    switch (status) {
        case 'OK':
            return [0, 128, 0]; // Vert
        case 'Non OK':
            return [255, 0, 0]; // Rouge
        case 'Non équipé':
            return [0, 0, 0]; // Noir
        default:
            return [0, 0, 0]; // Noir par défaut
    }
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const maxWidth = pageWidth - 2 * margin;
    const maxWidthphoto = 100;
    const maxHeight = pageHeight - 2 * margin;
    const maxHeightphoto = 100;
    let y = margin;
    const fontSize = 10; // Définir la taille de la police
    doc.setFontSize(fontSize+10);

    // Récupérer les informations supplémentaires
    const controlType = document.getElementById('control-type').value; // Nouveau champ ajouté
    const orderNumber = document.getElementById('order-number').value;
    const chassisNumber = document.getElementById('chassis-number').value; // Nouveau champ ajouté
    const registration = document.getElementById('registration').value;
    const mechanic = document.getElementById('mechanic').value;
    const vehicle = document.getElementById('vehicle').value;
    const mileage = document.getElementById('mileage').value;
    const dateTime = document.getElementById('date-time').value;
    
    // Centrage du titre
    const textWidth = doc.getTextWidth(`Type de contrôle: ${controlType}`);
    const xPosition = ((pageWidth / 2) - (textWidth / 2));
    let yPosition = margin + fontSize;

    // Ajouter les informations supplémentaires au PDF
    doc.text(`Type de contrôle: ${controlType}`, xPosition, y+5); // Ajouter le type de contrôle
    doc.setFontSize(fontSize);

    doc.text(`N° d'ordre: ${orderNumber}`, margin, y + 15);
    doc.text(`N° Chassis: ${chassisNumber}`, margin + 100 , y + 15); // Ajouter N° Chassis
    doc.text(`Immatriculation: ${registration}`, margin, y + 25);
    doc.text(`Mécanicien: ${mechanic}`, margin + 100, y + 25);
    doc.text(`Véhicule: ${vehicle}`, margin, y + 35);
    doc.text(`Kilomètres: ${mileage}`, margin + 100 , y + 35);
    doc.text(`Date et Heure du contrôle: ${dateTime}`, margin, y + 45);
    y += 55; // Ajuster y pour l'espace avant les contrôles

    // Ajouter une ligne de séparation
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    const controls = document.querySelectorAll('.control-item');

    for (let control of controls) {
        if (y + 20 > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }

        const description = control.querySelector('span').textContent;
        const status = control.getAttribute('data-status') || 'Non défini';
        const comment = control.querySelector('textarea').value;
        const photos = JSON.parse(control.getAttribute('data-photos') || '[]');

        doc.setFontSize(fontSize + 2); // Taille de la police pour les titres

        // Appliquer la couleur basée sur le statut
        const statusColor = getStatusColor(status);
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);

        doc.text(`Description: ${description}`, margin, y);
        y += 5;

        doc.setFontSize(fontSize);

        doc.text(`Statut: ${status}`, margin, y);
        y += 5;

        // Ajouter le commentaire avec retour à la ligne automatique
        const commentLines = doc.splitTextToSize(`Commentaire: ${comment}`, maxWidth);
        doc.text(commentLines, margin, y);
        y += 5 + (commentLines.length * 8); // Ajuster y en fonction de la hauteur du texte

        // Récupérer les dimensions du premier jeu de roues si elles existent
        if (description.includes('pneumatiques')) {
            const tireDimensions = control.querySelector('.tire-dimensions');
            const tireDimensions2 = control.querySelector('.tire-dimensions2');
            const secondSetCheckbox = control.querySelector('.second-set-checkbox');
            
            // Extraire les valeurs des dimensions
            const type = tireDimensions.querySelector('.tire-type').value;
            const width = tireDimensions.querySelector('.tire-width').value;
            const aspectRatio = tireDimensions.querySelector('.tire-aspect-ratio').value;
            const diameter = tireDimensions.querySelector('.tire-diameter').value;
            const loadIndex = tireDimensions.querySelector('.tire-load-index').value;
            
            // Ajouter les dimensions du premier jeu de roues
            doc.text(`Dimensions des pneus (1er jeu) : ${type}` , margin, y);
            y += 5;
            doc.text(`Largeur: ${width}`, margin, y);
            doc.text(`Taille: ${aspectRatio}`, margin + 40, y);
            doc.text(`Diamètre: ${diameter}`, margin + 80, y);
            doc.text(`Indices : ${loadIndex}`, margin + 120, y);
            y += 5;

            // Ajouter les dimensions du deuxième jeu de roues si la case est cochée
            if (secondSetCheckbox.checked) {
                const type2 = tireDimensions2.querySelector('.tire-type2').value;
                const width2 = tireDimensions2.querySelector('.tire-width2').value;
                const aspectRatio2 = tireDimensions2.querySelector('.tire-aspect-ratio2').value;
                const diameter2 = tireDimensions2.querySelector('.tire-diameter2').value;
                const loadIndex2 = tireDimensions2.querySelector('.tire-load-index2').value;

                doc.text(`Dimensions des pneus (2ème jeu) : ${type2}`, margin, y);
                y += 5;
                doc.text(`Largeur: ${width2}`, margin, y);
                doc.text(`Taille: ${aspectRatio2}`, margin + 40, y);
                doc.text(`Diamètre: ${diameter2}`, margin + 80 , y);
                doc.text(`Indices : ${loadIndex2}`, margin + 120, y);
                y += 5;
            }
        }

        // Récupérer les infos des services et expertise
        if (description.includes('service')) {

            // Récupérer les valeurs des champs de saisie
            const serviceDate = document.querySelector('.service-date').value;
            const mileage = document.querySelector('.mileage').value;
            const expertiseDate = document.querySelector('.expertise-date').value;

            // Récupérer les cases à cocher
            const checkboxes = document.querySelectorAll('.test-checkbox');
            const tests = Array.from(checkboxes).map(cb => cb.checked ? cb.nextSibling.textContent.trim() : null).filter(Boolean);

            // Ajouter les informations au PDF
            doc.text(`Date du dernier service: ${serviceDate}`, margin, y);
            y += 5;
            doc.text(`Kilomètres du dernier service: ${mileage}`, margin, y);
            y += 5;
            doc.text(`Date de la dernière expertise: ${expertiseDate}`, margin, y);
            y += 5;

            doc.text('Traveaux à réalisés:', margin, y);
            y += 5;
            tests.forEach((test, index) => {
                doc.text(`- ${test}`, margin, y + (index * 5));
            });

            y += (tests.length * 5) + 5;
        }

        for (let photo of photos) {
            if (photo.data) {
                const img = await loadImage(photo.data);

                // Calculer le ratio d'aspect
                const aspectRatio = img.width / img.height;

                // Ajuster les dimensions de l'image en fonction des limites
                let width = img.width;
                let height = img.height;

                if (width > maxWidthphoto) {
                    width = maxWidthphoto;
                    height = width / aspectRatio;
                }

                if (height > maxHeightphoto) {
                    height = maxHeightphoto;
                    width = height * aspectRatio;
                }

                if (y + height > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }

                doc.addImage(photo.data, 'JPEG', margin, y, width, height);
                y += height + 10;

                if (y + 30 > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
            }
        }

        doc.line(margin, y, pageWidth - margin, y);
        y += 10;
    }

    // Construire le nom du fichier
    const fileName = `${controlType} ${chassisNumber}.pdf`;

    doc.save(fileName);
}
