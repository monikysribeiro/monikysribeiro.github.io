document.addEventListener("DOMContentLoaded", () => {
    // Add initial hazards textboxes
    addAccidentField();
    addHazardField();
    addUcaField();
    addCauseField();
    addMitigationsField();    
});

function addField(containerId, name) {
    const container = document.getElementById(containerId);

    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group";

    // Cria o campo de entrada
    const newField = document.createElement("input");
    newField.type = "text";
    newField.name = `${name}[]`;
    newField.placeholder = "Exemplo: 'Manual LX300'...";

    // Botão de adicionar
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "add-btn";
    addButton.textContent = "+";
    addButton.onclick = function () {
        addField(containerId, name);
        if (name === "components") {
            updateComponentSelector();
        }
        else if (name == "accidents"){
           updateAccidentSelector();
        }
        else if (name == "hazards"){
            updateHazardSelector();
         }
         else if (name == "mitigations"){
            updateAssociationSelector();
         }         
    };

    // Botão de remover
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-btn";
    removeButton.textContent = "-";
    removeButton.onclick = function () {
        removeField(this);
        if (name === "components") {
            updateComponentSelector();
        }
        else if (name == "accidents"){
           updateAccidentSelector();
        }
        else if (name == "ucas"){
            updateUcaSelector();
         }
         else if (name == "causes"){
            updateCauseSelector();
         }
         else if (name == "mitigations"){
            updateAssociationSelector();
         } 
    };

    // Adiciona os elementos ao grupo de entrada
    inputGroup.appendChild(newField);
    inputGroup.appendChild(addButton);
    inputGroup.appendChild(removeButton);

    // Adiciona o grupo de entrada ao contêiner
    container.appendChild(inputGroup);

    if (name === "components") {
        updateComponentSelector();
    }
    else if (name == "accidents"){
        updateAccidentSelector();
     }
     else if (name == "ucas"){
        updateUcaSelector();
     }
     else if (name == "ucas"){
        updateCauseSelector();
     }
     else if (name == "mitigations"){
        updateAssociationSelector();
     } 
}

// Função para remover o grupo associado ao botão de menos
function removeField(button) {
    const container = button.parentElement.parentElement; 
    const inputGroup = button.parentElement;     
    if (container.children.length > 1) {
        container.removeChild(inputGroup);
    } else {
        alert("Não é possível remover todos os campos. Deve haver pelo menos um.");
    }
}

function addAccidentField(){
    const container = document.getElementById("accident-container");
    const currentCountA = container.querySelectorAll(".accident-group").length;

    const accidentGroup = document.createElement("div");
    accidentGroup.className = "accident-group";
    accidentGroup.style.display = "flex";
    accidentGroup.style.alignItems = "center";
    accidentGroup.style.marginBottom = "1rem";

    const accidentInput = document.createElement("input");
    accidentInput.type = "text";
    accidentInput.name = "accidents[]";
    accidentInput.placeholder = `A${currentCountA + 1} - Describe the accident`;
    accidentInput.className = "accident-input";

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "small-add-btn";
    addButton.textContent =  "+";
    addButton.onclick = addAccidentField;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "small-add-btn";
    removeButton.textContent =  "-";
    removeButton.onclick = function(){
        removeField(this);
    };

    const selectGroup =  document.createElement("div");
    selectGroup.className = "select-group";
    selectGroup.style.marginLeft = "1rem";
    selectGroup.style.flex = "1";

    const label = document.createElement("label");
    label.textContent = "Associar componente responsável";

    const select = document.createElement("select");
    select.className = "associated-component-select";
    select.disabled = false;
    select.addEventListener("change", function(){
        addComponentFeedback(select, feedbackContainer);
    });

    const feedbackContainer = document.createElement("div");
    feedbackContainer.className = "associated-feedback";

    selectGroup.appendChild(label);
    selectGroup.appendChild(select);
    selectGroup.appendChild(feedbackContainer);

    accidentGroup.appendChild(accidentInput);
    accidentGroup.appendChild(addButton);
    accidentGroup.appendChild(removeButton);
    accidentGroup.appendChild(selectGroup);

    container.appendChild(accidentGroup);

    updateComponentSelector();
}

function addComponentFeedback(select, container){
    if (!select.value) return;

    const feedbackItem = document.createElement("span");
    feedbackItem.className = "feedback-item";
    feedbackItem.textContent = select.options[select.selectedIndex].text;
    feedbackItem.dataset.componentValue = select.value;
    feedbackItem.style.cursor = "pointer";
    feedbackItem.title = "Clique para remover";

feedbackItem.addEventListener("click", function() {
    removeAssociatedComponent(feedbackItem, select);
    });

    container.appendChild(feedbackItem);

    select.options[select.selectedIndex].remove();

    const remainingOptions = Array.from(select.options).filter(option => option.value!=="");

    if (remainingOptions.length === 0) {
        select.disabled = true;
    }
    else{
        select.selectedIndex = 0
    }

}

function removeAssociatedComponent(feedbackItem,select){
    const componentValue = feedbackItem.dataset.componentValue;
    const componentLabel = feedbackItem.textContent;

    // Cria uma nova opção para o seletor
    const option = document.createElement("option");
    option.value = componentValue;
    option.textContent = componentLabel;

    // Adiciona de volta ao seletor
    select.appendChild(option);

    // Remove o feedback da tela
    feedbackItem.remove();
    select.disabled = false;
}

function updateComponentSelector(){
    const components = Array.from(document.querySelectorAll("input[name='components[]']"))
    .map((component, index) => {
        const value = component.value;
        const thirdChar = value.charAt(2);
        const isThirdCharNumber = !isNaN(thirdChar) && thirdChar !== "";
        
        return{
        value: `C${index + 1}`,
        label: isThirdCharNumber ? value.substring(0,3) : value.substring(0,2),
        };
    })
      .filter(component => component.label.trim() !== "")
    
      const selectors = document.querySelectorAll(".associated-component-select");
      selectors.forEach(select => {
              const associatedValues = Array.from(
              select.parentElement.querySelectorAll(".feedback-item")
          ).map(item => item.dataset.componentValue);
  
          const availableComponents = components.filter(
              component => !associatedValues.includes(component.value)
          );
  
          select.innerHTML = '<option value="" disabled selected>Selecione um componente</option>';
  
          // Adiciona os componentes disponíveis ao seletor
          availableComponents.forEach(component => {
              const option = document.createElement("option");
              option.value = component.value;
              option.textContent = component.label;
              select.appendChild(option);
          });
  
          // Habilita ou desabilita o seletor com base nas opções disponíveis
          select.disabled = availableComponents.length === 0;
      });
}

//inicio hazard
function addHazardField() {  
    const container = document.getElementById("hazards-container");
    const currentCountH = container.querySelectorAll(".hazard-group").length;

    // Cria o grupo do perigo
    const hazardGroup = document.createElement("div");
    hazardGroup.className = "hazard-group";
    hazardGroup.style.display = "flex";
    hazardGroup.style.alignItems = "center";
    hazardGroup.style.marginBottom = "1rem";

    // Campo de entrada do perigo
    const hazardInput = document.createElement("input");
    hazardInput.type = "text";
    hazardInput.name = "hazards[]";
    hazardInput.placeholder = `H${currentCountH + 1} - Descreva o Hazard`;
    hazardInput.className = "hazard-input";

    // Botão de adicionar
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "small-add-btn"; // Estilo do botão pequeno
    addButton.textContent = "+";
    addButton.onclick = addHazardField;

    // Botão de remover
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "small-add-btn";
    removeButton.textContent = "-";
    removeButton.onclick = function () {
        removeField(this);
    };    

    // Campo de associação (Acidentes/Perigos)
    const selectGroup = document.createElement("div");
    selectGroup.className = "select-group";
    selectGroup.style.marginLeft = "1rem";
    selectGroup.style.flex = "1";

    const label = document.createElement("label");
    label.textContent = "Associar Acidentes/Perigos";

    const select = document.createElement("select");
    select.className = "associated-accident-select";
    select.dataset.owner = `H${currentCountH + 1}`; // Identifica o perigo atual para exclusão no seletor
    select.addEventListener("change", function () {
        addAccidentFeedback(select, feedbackContainer);
    });

    const feedbackContainer = document.createElement("div");
    feedbackContainer.className = "associated-feedback";

    selectGroup.appendChild(label);
    selectGroup.appendChild(select);
    selectGroup.appendChild(feedbackContainer);

    // Adiciona os elementos ao grupo do perigo
    hazardGroup.appendChild(hazardInput);
    hazardGroup.appendChild(addButton);
    hazardGroup.appendChild(removeButton);
    hazardGroup.appendChild(selectGroup);

    // Adiciona o grupo ao contêiner
    container.appendChild(hazardGroup);

    // Atualiza os seletores
    updateAccidentSelector();
}

function addAccidentFeedback(select, container) {
    if (!select.value) return;

    const feedbackItem = document.createElement("span");
    feedbackItem.className = "feedback-item";
    feedbackItem.textContent = select.options[select.selectedIndex].text;
    feedbackItem.dataset.accidentValue = select.value;
    feedbackItem.style.cursor = "pointer";
    feedbackItem.title = "Clique para remover";

    feedbackItem.addEventListener("click", function() {
        removeAssociatedAccident(feedbackItem, select);
    });

    container.appendChild(feedbackItem);

    select.options[select.selectedIndex].remove();

    const remainingOptions = Array.from(select.options).filter(option => option.value !== "");
    select.disabled = remainingOptions.length === 0;
    if (remainingOptions.length > 0) {
        select.selectedIndex = 0;
    }
}

function removeAssociatedAccident(feedbackItem, select) {
    const accidentValue = feedbackItem.dataset.accidentValue;
    const accidentLabel = feedbackItem.textContent;

    // Cria uma nova opção para o seletor
    const option = document.createElement("option");
    option.value = accidentValue;
    option.textContent = accidentLabel;

    // Adiciona de volta ao seletor
    select.appendChild(option);

    // Remove o feedback da tela
    feedbackItem.remove();
    select.disabled = false;
}

function updateAccidentSelector() {
    // Obtém os acidentes
    const accidents = Array.from(document.querySelectorAll("input[name='accidents[]']"))
        .map((accident, index) => ({
            value: `A${index + 1}`,
            label: accident.value.trim().substring(0, 3)
        }));

    // Obtém os perigos (hazards)
    const hazards = Array.from(document.querySelectorAll("input[name='hazards[]']"))
        .map((hazard, index) => ({
            value: `H${index + 1}`,
            label: hazard.value.trim().substring(0, 3)
        }));

    // Combina acidentes e perigos
    const allItems = [...accidents, ...hazards].filter(item => item.label.trim() !== "");

    // Atualiza todos os seletores com a classe 'associated-accident-select'
    const selectors = document.querySelectorAll(".associated-accident-select");
    selectors.forEach(select => {
        const owner = select.dataset.owner; // Identifica o owner para excluir da lista

        // Obtém os valores associados no seletor atual
        const associatedValues = Array.from(
            select.parentElement.querySelectorAll(".feedback-item")
        ).map(item => item.dataset.accidentValue);

        // Filtra as opções disponíveis para evitar duplicações e excluir o próprio owner
        const availableItems = allItems.filter(
            item => !associatedValues.includes(item.value) && item.value !== owner
        );

        // Reseta o seletor e adiciona as opções disponíveis
        select.innerHTML = '<option value="" disabled selected>Selecione uma opção</option>';
        availableItems.forEach(item => {
            const option = document.createElement("option");
            option.value = item.value;
            option.textContent = item.label;
            select.appendChild(option);
        });

        // Habilita ou desabilita o seletor com base nas opções disponíveis
        select.disabled = availableItems.length === 0;
    });
}

// Função para remover um grupo associado ao botão de menos
function removeField(button) {
    const container = button.parentElement.parentElement; // O contêiner principal
    const inputGroup = button.parentElement; // O grupo específico a ser removido

    // Permite a remoção apenas se houver mais de um grupo no contêiner
    if (container.children.length > 1) {
        container.removeChild(inputGroup);
        updateAccidentSelector(); // Atualiza os seletores após a remoção
    } else {
        alert("Não é possível remover todos os campos. Deve haver pelo menos um.");
    }
}

//fim hazard
//INICIO UCA
function addUcaField(){
    const container = document.getElementById("uca-container");
    const currentCountU = container.querySelectorAll(".uca-group").length;

    const ucaGroup = document.createElement("div");
    ucaGroup.className = "uca-group";
    ucaGroup.style.display = "flex";
    ucaGroup.style.alignItems = "center";
    ucaGroup.style.marginBottom = "1rem";

    const ucaInput = document.createElement("input");
    ucaInput.type = "text";
    ucaInput.name = "ucas[]";
    ucaInput.placeholder = `UCA${currentCountU + 1} - Describe the UCA`;
    ucaInput.className = "uca-input";

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "small-add-btn";
    addButton.textContent =  "+";
    addButton.onclick = addUcaField;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "small-add-btn";
    removeButton.textContent =  "-";
    removeButton.onclick = function(){
        removeField(this);
    };

    const selectGroup =  document.createElement("div");
    selectGroup.className = "select-group";
    selectGroup.style.marginLeft = "1rem";
    selectGroup.style.flex = "1";

    const label = document.createElement("label");
    label.textContent = "Associar perigo";

    const select = document.createElement("select");
    select.className = "associated-hazard-select";
    select.disabled = false;
    select.addEventListener("change", function(){
        addHazardFeedback(select, feedbackContainer);
        addCauseFeedback(select, feedbackContainer);
    });

    const feedbackContainer = document.createElement("div");
    feedbackContainer.className = "associated-feedback";

    selectGroup.appendChild(label);
    selectGroup.appendChild(select);
    selectGroup.appendChild(feedbackContainer);

    ucaGroup.appendChild(ucaInput);
    ucaGroup.appendChild(addButton);
    ucaGroup.appendChild(removeButton);
    ucaGroup.appendChild(selectGroup);

    container.appendChild(ucaGroup);

    updateHazardSelector();
}

function addHazardFeedback(select, container){
    if (!select.value) return;

    const feedbackItem = document.createElement("span");
    feedbackItem.className = "feedback-item";
    feedbackItem.textContent = select.options[select.selectedIndex].text;
    feedbackItem.dataset.hazardValue = select.value;
    feedbackItem.style.cursor = "pointer";
    feedbackItem.title = "Clique para remover";

    feedbackItem.addEventListener("click", function() {
        removeAssociatedHazard(feedbackItem, select);
        });

    container.appendChild(feedbackItem);

    select.options[select.selectedIndex].remove();

    const remainingOptions = Array.from(select.options).filter(option => option.value!=="");
    if (remainingOptions.length === 0) {
        select.disabled = true;
    }
    else{
        select.selectedIndex = 0
    }

}

function removeAssociatedHazard(feedbackItem,select){
    const hazardValue = feedbackItem.dataset.hazardValue;
    const hazardLabel = feedbackItem.textContent;

    // Cria uma nova opção para o seletor
    const option = document.createElement("option");
    option.value = hazardValue;
    option.textContent = hazardLabel;

    // Adiciona de volta ao seletor
    select.appendChild(option);

    // Remove o feedback da tela
    feedbackItem.remove();
    select.disabled = false;
}

function updateHazardSelector(){
    const hazards = Array.from(document.querySelectorAll("input[name='hazards[]']"))
    .map((hazard, index) => {
        const value = hazard.value;
        const thirdChar = value.charAt(2);
        const isThirdCharNumber = !isNaN(thirdChar) && thirdChar !== "";
        
        return{
        value: `H${index + 1}`,
        label: isThirdCharNumber ? value.substring(0,3) : value.substring(0,2),
        };
    })
      .filter(hazard => hazard.label.trim() !== "")
    
      const selectors = document.querySelectorAll(".associated-hazard-select");
      selectors.forEach(select => {
              const associatedValues = Array.from(
              select.parentElement.querySelectorAll(".feedback-item")
          ).map(item => item.dataset.hazardValue);
  
          const availableHazards= hazards.filter(
            hazard => !associatedValues.includes(hazard.value)
          );
  
          select.innerHTML = '<option value="" disabled selected>Selecione um perigo</option>';
  
          
          availableHazards.forEach(hazard => {
              const option = document.createElement("option");
              option.value = hazard.value;
              option.textContent = hazard.label;
              select.appendChild(option);
          });
  
          // Habilita ou desabilita o seletor com base nas opções disponíveis
          select.disabled = availableHazards.length === 0;
      });
}
//FIM UCA

// INICIO CAUSE
function addCauseFeedback(select, container){
    if (!select.value) return;

    const feedbackItem = document.createElement("span");
    feedbackItem.className = "feedback-item";
    feedbackItem.textContent = select.options[select.selectedIndex].text;
    feedbackItem.dataset.causeValue = select.value;
    feedbackItem.style.cursor = "pointer";
    feedbackItem.title = "Clique para remover";

    feedbackItem.addEventListener("click", function() {
        removeAssociatedCause(feedbackItem, select);
        });

    container.appendChild(feedbackItem);

    select.options[select.selectedIndex].remove();

    const remainingOptions = Array.from(select.options).filter(option => option.value!=="");
    if (remainingOptions.length === 0) {
        select.disabled = true;
    }
    else{
        select.selectedIndex = 0
    }
}

function removeAssociatedCause(feedbackItem,select){
    const causeValue = feedbackItem.dataset.causeValue;
    const causeLabel = feedbackItem.textContent;

    // Cria uma nova opção para o seletor
    const option = document.createElement("option");
    option.value = causeValue;
    option.textContent = causeLabel;

    // Adiciona de volta ao seletor
    select.appendChild(option);

    // Remove o feedback da tela
    feedbackItem.remove();
    select.disabled = false;
}


function addCauseField() {
    const container = document.getElementById("causes_hazards-container");
    const currentCountCa = container.querySelectorAll(".cause-group").length;

    const causeGroup = document.createElement("div");
    causeGroup.className = "cause-group";
    causeGroup.style.display = "flex";
    causeGroup.style.alignItems = "center";
    causeGroup.style.marginBottom = "1rem";

    const causeInput = document.createElement("input");
    causeInput.type = "text";
    causeInput.name = "causes[]";
    causeInput.placeholder = `HC${currentCountCa + 1} - Describe the Hazard Cause`;
    causeInput.className = "cause-input";

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "small-add-btn";
    addButton.textContent = "+";
    addButton.onclick = addCauseField;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "small-add-btn";
    removeButton.textContent = "-";
    removeButton.onclick = function () {
        removeCauseField(this);
    };

    const selectGroup = document.createElement("div");
    selectGroup.className = "select-group";
    selectGroup.style.marginLeft = "1rem";
    selectGroup.style.flex = "1";

    const label = document.createElement("label");
    label.textContent = "Associar perigo";

    const select = document.createElement("select");
    select.className = "associated-hazard-select";
    select.disabled = false;
    select.addEventListener("change", function () {
        addCauseHazardFeedback(select, feedbackContainer);
    });

    const feedbackContainer = document.createElement("div");
    feedbackContainer.className = "associated-feedback";

    selectGroup.appendChild(label);
    selectGroup.appendChild(select);
    selectGroup.appendChild(feedbackContainer);

    causeGroup.appendChild(causeInput);
    causeGroup.appendChild(addButton);
    causeGroup.appendChild(removeButton);
    causeGroup.appendChild(selectGroup);

    container.appendChild(causeGroup);

    updateCauseHazardSelector(); // Atualiza as opções do seletor
}

function addCauseHazardFeedback(select, container) {
    if (!select.value) return;

    const feedbackItem = document.createElement("span");
    feedbackItem.className = "feedback-item";
    feedbackItem.textContent = select.options[select.selectedIndex].text;
    feedbackItem.dataset.hazardValue = select.value;
    feedbackItem.style.cursor = "pointer";
    feedbackItem.title = "Clique para remover";

    feedbackItem.addEventListener("click", function () {
        removeAssociatedCauseHazard(feedbackItem, select);
    });

    container.appendChild(feedbackItem);

    select.options[select.selectedIndex].remove();

    const remainingOptions = Array.from(select.options).filter(option => option.value !== "");
    select.disabled = remainingOptions.length === 0;
}

function removeAssociatedCauseHazard(feedbackItem, select) {
    const hazardValue = feedbackItem.dataset.hazardValue;
    const hazardLabel = feedbackItem.textContent;

    // Cria uma nova opção para o seletor
    const option = document.createElement("option");
    option.value = hazardValue;
    option.textContent = hazardLabel;

    // Adiciona de volta ao seletor
    select.appendChild(option);

    // Remove o feedback da tela
    feedbackItem.remove();
    select.disabled = false;
}

function updateCauseHazardSelector() {
    const hazards = Array.from(document.querySelectorAll("input[name='hazards[]']"))
        .map((hazard, index) => {
            const value = hazard.value;
            const thirdChar = value.charAt(2);
            const isThirdCharNumber = !isNaN(thirdChar) && thirdChar !== "";

            return {
                value: `H${index + 1}`,
                label: isThirdCharNumber ? value.substring(0, 3) : value.substring(0, 2),
            };
        })
        .filter(hazard => hazard.label.trim() !== "");

    const selectors = document.querySelectorAll(".associated-hazard-select");
    selectors.forEach(select => {
        const associatedValues = Array.from(
            select.parentElement.querySelectorAll(".feedback-item")
        ).map(item => item.dataset.hazardValue);

        const availableHazards = hazards.filter(
            hazard => !associatedValues.includes(hazard.value)
        );

        select.innerHTML = '<option value="" disabled selected>Selecione um perigo</option>';

        availableHazards.forEach(hazard => {
            const option = document.createElement("option");
            option.value = hazard.value;
            option.textContent = hazard.label;
            select.appendChild(option);
        });

        // Habilita ou desabilita o seletor com base nas opções disponíveis
        select.disabled = availableHazards.length === 0;
    });
}

// Função para remover um grupo associado ao botão de menos
function removeCauseField(button) {
    const container = button.parentElement.parentElement; // O contêiner principal
    const inputGroup = button.parentElement; // O grupo específico a ser removido

    // Permite a remoção apenas se houver mais de um grupo no contêiner
    if (container.children.length > 1) {
        const feedbackItems = inputGroup.querySelectorAll(".feedback-item");
        feedbackItems.forEach(item => {
            // Reinsere os itens associados no seletor global
            const select = inputGroup.querySelector(".associated-hazard-select");
            if (select) {
                const option = document.createElement("option");
                option.value = item.dataset.hazardValue;
                option.textContent = item.textContent;
                select.appendChild(option);
            }
        });

        // Remove o grupo do DOM
        container.removeChild(inputGroup);

        // Atualiza os seletores
        updateCauseHazardSelector();
    } else {
        alert("Não é possível remover todos os campos. Deve haver pelo menos um.");
    }
}

//FIM CAUSE


//INICIO MITIGATION
function addMitigationsField() {
    const container = document.getElementById("mitigations-container");
    const currentCountM = container.querySelectorAll(".mitigations-group").length;

    const mitigationsGroup = document.createElement("div");
    mitigationsGroup.className = "mitigations-group";
    mitigationsGroup.style.display = "flex";
    mitigationsGroup.style.alignItems = "center";
    mitigationsGroup.style.marginBottom = "1rem";

    const mitigationsInput = document.createElement("input");
    mitigationsInput.type = "text";
    mitigationsInput.name = "mitigations[]";
    mitigationsInput.placeholder = `SC${currentCountM + 1} - Describe the Safety Constraint`;
    mitigationsInput.className = "mitigations-input";

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "small-add-btn";
    addButton.textContent = "+";
    addButton.onclick = addMitigationsField;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "small-add-btn";
    removeButton.textContent = "-";
    removeButton.onclick = function () {
        removeField(this);
    };

    const selectGroup = document.createElement("div");
    selectGroup.className = "select-group";
    selectGroup.style.marginLeft = "1rem";
    selectGroup.style.flex = "1";

    const label = document.createElement("label");
    label.textContent = "Associar hazard/cause/UCA";

    const select = document.createElement("select");
    select.className = "associated-hazard-select";
    select.disabled = false;
    select.addEventListener("change", function () {
        addHazardFeedback(select, feedbackContainer);
    });

    const feedbackContainer = document.createElement("div");
    feedbackContainer.className = "associated-feedback";

    selectGroup.appendChild(label);
    selectGroup.appendChild(select);
    selectGroup.appendChild(feedbackContainer);

    mitigationsGroup.appendChild(mitigationsInput);
    mitigationsGroup.appendChild(addButton);
    mitigationsGroup.appendChild(removeButton);
    mitigationsGroup.appendChild(selectGroup);

    container.appendChild(mitigationsGroup);

    updateAssociationSelector(); // Atualiza as opções disponíveis nos seletores
}

function updateAssociationSelector() {
    // Obtém todos os hazards, causas e UCAs
    const hazards = Array.from(document.querySelectorAll("input[name='hazards[]']"))
        .map((hazard, index) => ({
            value: `H${index + 1}`,
            label: hazard.value.trim().substring(0, 3)
        }));

    const causes = Array.from(document.querySelectorAll("input[name='causes[]']"))
        .map((cause, index) => ({
            value: `HC${index + 1}`,
            label: cause.value.trim().substring(0, 3)
        }));

    const ucas = Array.from(document.querySelectorAll("input[name='ucas[]']"))
        .map((uca, index) => ({
            value: `UCA${index + 1}`,
            label: uca.value.trim().substring(0, 4)
        }));

    // Combina todas as opções disponíveis
    const allItems = [...hazards, ...causes, ...ucas].filter(item => item.label.trim() !== "");

    // Rastreia todos os elementos já associados
    const associatedItems = {};
    document.querySelectorAll(".associated-feedback .feedback-item").forEach(item => {
        const value = item.dataset.hazardValue || item.dataset.causeValue || item.dataset.ucaValue;
        if (value) {
            associatedItems[value] = true; // Marca como associado
        }
    });

    // Atualiza todos os seletores com a classe 'associated-hazard-select'
    const selectors = document.querySelectorAll(".associated-hazard-select");
    selectors.forEach(select => {
        // Obtém os valores associados localmente (dentro do seletor atual)
        const localAssociatedValues = Array.from(
            select.parentElement.querySelectorAll(".feedback-item")
        ).map(item => item.dataset.hazardValue || item.dataset.causeValue || item.dataset.ucaValue);

        // Filtra as opções disponíveis para evitar duplicações e excluir itens já associados
        const availableOptions = allItems.filter(
            option => !associatedItems[option.value] && !localAssociatedValues.includes(option.value)
        );

        // Reseta o seletor e adiciona as novas opções disponíveis
        select.innerHTML = '<option value="" disabled selected>Selecione uma opção</option>';
        availableOptions.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            select.appendChild(optionElement);
        });

        // Habilita ou desabilita o seletor com base nas opções disponíveis
        select.disabled = availableOptions.length === 0;
    });
}

function addHazardFeedback(select, container) {
    if (!select.value) return;

    const feedbackItem = document.createElement("span");
    feedbackItem.className = "feedback-item";
    feedbackItem.textContent = select.options[select.selectedIndex].text;
    feedbackItem.dataset.hazardValue = select.value;
    feedbackItem.style.cursor = "pointer";
    feedbackItem.title = "Clique para remover";

    feedbackItem.addEventListener("click", function () {
        removeAssociatedHazard(feedbackItem, select);
    });

    container.appendChild(feedbackItem);

    select.options[select.selectedIndex].remove();

    const remainingOptions = Array.from(select.options).filter(option => option.value !== "");
    select.disabled = remainingOptions.length === 0;
}

function removeAssociatedHazard(feedbackItem, select) {
    const hazardValue = feedbackItem.dataset.hazardValue;
    const hazardLabel = feedbackItem.textContent;

    // Cria uma nova opção para o seletor
    const option = document.createElement("option");
    option.value = hazardValue;
    option.textContent = hazardLabel;

    // Adiciona de volta ao seletor
    select.appendChild(option);

    // Remove o feedback da tela
    feedbackItem.remove();
    select.disabled = false;

    updateAssociationSelector(); // Atualiza as opções para outros seletores
}

// Função para remover um grupo associado ao botão de menos
function removeField(button) {
    const container = button.parentElement.parentElement; // O contêiner principal
    const inputGroup = button.parentElement; // O grupo específico a ser removido

    // Permite a remoção apenas se houver mais de um grupo no contêiner
    if (container.children.length > 1) {
        container.removeChild(inputGroup);
        updateAssociationSelector(); // Atualiza os seletores após a remoção
    } else {
        alert("Não é possível remover todos os campos. Deve haver pelo menos um.");
    }
}

//FIM MITIGATION

// Função para salvar os dados do formulário como JSON em um arquivo de texto
function saveAsTxt() {
    const requiredFields = [
        { id: 'iteration-number', name: 'Iteração' },
        { id: 'objetivos', name: 'Objetivos da Análise' },
        { id: 'sistema', name: 'Definição do Sistema' }
    ];

    for (const field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            alert(`O campo obrigatório "${field.name}" não foi preenchido.`);
            element.focus();
            return;
        }
    }

    const formData = {
        iterationNumber: document.getElementById('iteration-number').value,
        objetivos: document.getElementById('objetivos').value,
        sistema: document.getElementById('sistema').value,
        recursos: Array.from(document.querySelectorAll("input[name='recursos[]']")).map(input => input.value),
        componentes: Array.from(document.querySelectorAll("input[name='components[]']")).map(input => input.value),
        stakeholders: document.getElementById('stakeholders').value,
        accidents: Array.from(document.querySelectorAll("input[name='accidents[]']")).map(input => input.value),
        hazards: Array.from(document.querySelectorAll("input[name='hazards[]']")).map(input => input.value),
        ucas: Array.from(document.querySelectorAll("input[name='ucas[]']")).map(input => input.value),
        causes_hazards: Array.from(document.querySelectorAll("input[name='causes_hazards[]']")).map(input => input.value),
        mitigations: Array.from(document.querySelectorAll("input[name='mitigations[]']")).map(input => input.value),
    };

    const jsonString = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonString], { type: "text/plain" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "analysis_data.txt";
    link.click();

    URL.revokeObjectURL(link.href);
}

// Função para salvar os dados do formulário como um documento .doc
function saveAsDoc() {
    const form = document.querySelector("form");

    let docContent = `<html><head><meta charset="UTF-8"></head><body>`;
    docContent += `<h1>${document.querySelector("h1").innerText}</h1>`;

    form.querySelectorAll("fieldset").forEach(fieldset => {
        const legend = fieldset.querySelector("legend").innerText;
        docContent += `<h2>${legend}</h2>`;

        fieldset.querySelectorAll(".form-group").forEach(group => {
            const label = group.querySelector("label").innerText;
            let value;

            if (group.querySelector("textarea")) {
                value = group.querySelector("textarea").value;
            } else if (group.querySelector("input[type='text'], input[type='number']")) {
                value = Array.from(group.querySelectorAll("input")).map(input => input.value).join(", ");
            }

            docContent += `<p><strong>${label}:</strong> ${value || ''}</p>`;
        });
    });

    docContent += `</body></html>`;

    const blob = new Blob([docContent], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "analysis_data.doc";
    link.click();

    URL.revokeObjectURL(link.href);
}

let currentLanguage = "pt";

const translations = {
    pt: {
        title: "Passo 1 - Definir Escopo do Sistema Crítico de Segurança (SCS)",
        title_url: "ReSafety - Passo 1 - Formulário Inicial",
        iteration: "Iteração nº",
        generalLegend: "Questões gerais",
        objetivos: "Objetivos da análise",
        sistema: "Definição do sistema",
        recursos: "Documentos externos para Análise",
        componentes: "Componentes do sistema",
        stakeholders: "Stakeholders estratégicos",
        safetyLegend: "Questões de Segurança",
        accidents: "Identificação de acidentes",
        hazards: "Identificação de perigos à nível do sistema",
        ucas: "Ações de controle não-seguras (UCAs) relacionadas a perigos",
        causes: "Causes dos perigos",
        mitigations: "Mitigações de perigos",
        placeholders: {
            objetivos_place: "Defina os objetivos da análise...",
            sistema_place: "Descreva o sistema e seu escopo...",
            stakeholders_place: "Ex.: Médico, enfermeiro...",
            recursos_place: "Exemplo: 'Manual LX300'",
            componentes_place: "Exemplo: Controlador da bomba de insulina, médico",
            accidents_place: "A1 - (exemplo) Perda de vida ou lesão a pessoas",
            hazards_place: "H1 - Sistema & Condição Insegura & Link para Acidentes",
            ucas_place: "UCA1 - Comandos de dosagem basal excessiva [Hx] [Hz]",
            causes_place: "HC1 - Comando excessivo...[Hx] [Hz]",
            mitigations_place: "C1 - Não enviar dosagem basal [UCAx]",
            addField: "Adicionar outro..."
        }
    },
    en: {
        title_url: "ReSafety - Step 1 - Inicial Form",
        title: "Step 1 - Define the Scope of the Critical Safety System (CSS)",
        iteration: "Iteration nº",
        generalLegend: "General questions",
        objetivos: "Analysis objectives",
        sistema: "System definition",
        recursos: "External documents for analysis",
        componentes: "System components",
        stakeholders: "Strategic stakeholders",
        safety: "Safety Questions",
        safetyLegend: "Safety Questions",
        accidents: "Accident identification",
        hazards: "System-level hazards identification",
        ucas: "Unsafe Control Actions (UCAs) related to hazards",
        causes: "Hazard causes",
        mitigations: "Hazard mitigations",
        placeholders: {
            objetivos_place: "Define the analysis objectives...",
            sistema_place: "Describe the system and its scope...",
            stakeholders_place: "Ex.: Doctor, nurse...",
            recursos_place: "Example: 'Manual LX300'",
            componentes_place: "Example: Insulin pump controller, doctor",
            accidents_place: "A1 - (example) Loss of life or injury to people",
            hazards_place: "H1 - System & Unsafe Condition & Link to Accidents",
            ucas_place: "UCA1 - Commands excessive basal dosage [Hx] [Hz]",
            causes_place_place: "HC1 - Excessive command...[Hx] [Hz]",
            mitigations_place: "C1 - Do not send basal dosage [UCAx]",
            addField: "Add another..."
        }
    }
};

function toggleLanguage() {
    document.getElementById("language-toggle").textContent = currentLanguage === "pt" ? "EN" : "PT";
    currentLanguage = currentLanguage === "pt" ? "en" : "pt";
    const lang = translations[currentLanguage];

    // Atualiza os textos das labels e títulos
    document.getElementById("title_url").textContent = lang.title_url;
    document.getElementById("page-title").textContent = lang.title;
    document.getElementById("iteration-label").textContent = lang.iteration;
    document.getElementById("general-legend").textContent = lang.generalLegend;
    document.getElementById("objetivos-label").textContent = lang.objetivos;
    document.getElementById("sistema-label").textContent = lang.sistema;
    document.getElementById("recursos-label").textContent = lang.recursos;
    document.getElementById("componentes-label").textContent = lang.componentes;
    document.getElementById("stakeholders-label").textContent = lang.stakeholders;
    document.getElementById("safety-legend").textContent = lang.safetyLegend;
    document.getElementById("accident-label").textContent = lang.accidents;
    document.getElementById("hazards-label").textContent = lang.hazards;
    document.getElementById("ucas-label").textContent = lang.ucas;
    document.getElementById("causes-label").textContent = lang.causes;
    document.getElementById("mitigations-label").textContent = lang.mitigations;

    // Atualiza os placeholders dos campos de texto
    document.getElementById("objetivos").placeholder = lang.placeholders.objetivos_place;
    document.getElementById("sistema").placeholder = lang.placeholders.sistema_place;
    document.getElementById("stakeholders").placeholder = lang.placeholders.stakeholders_place;
    document.getElementById("recursos-placeholder").placeholder = lang.placeholders.recursos_place;
    document.getElementById("componentes-placeholder").placeholder = lang.placeholders.componentes_place;
    document.getElementById("accidents-placeholder").placeholder = lang.placeholders.accidents_place;
    document.getElementById("hazards-placeholder").placeholder = lang.placeholders.hazards_place;
    document.getElementById("ucas-placeholder").placeholder = lang.placeholders.ucas_place;
    document.getElementById("causes-placeholder").placeholder = lang.placeholders.causes_place;
    document.getElementById("mitigations-placeholder").placeholder = lang.placeholders.mitigations_place;

    
}
