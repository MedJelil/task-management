document.addEventListener("DOMContentLoaded", () => {
  const interventionTableBody = document.getElementById(
    "interventionTableBody"
  );
  const searchInput = document.getElementById("searchInput");
  const addInterventionBtn = document.getElementById("addInterventionBtn");
  const interventionModal = document.getElementById("interventionModal");
  const closeInterventionModal = document.getElementById(
    "closeInterventionModal"
  );
  const interventionForm = document.getElementById("interventionForm");
  const modalInterventionTitle = document.getElementById(
    "modalInterventionTitle"
  );
  const submitInterventionBtn = document.getElementById(
    "submitInterventionBtn"
  );
  const intervenantIdInterventionInput = document.getElementById(
    "intervenantIdInterventionInput"
  );
  const clientIdInterventionInput = document.getElementById(
    "clientIdInterventionInput"
  );

  let interventions = [];
  let interventionsToExport = interventions;
  let editingInterventionId = null;
  let intervenants = [];
  let clients = [];

  async function fetchInterventions() {
    try {
      const response = await fetch("http://localhost:3000/api/interventions");
      if (!response.ok) {
        throw new Error("Failed to fetch interventions");
      }
      interventions = await response.json();
      renderInterventions(interventions);
    } catch (error) {
      console.error("Error fetching interventions:", error);
    }
  }

  async function fetchIntervenants() {
    try {
      const response = await fetch("http://localhost:3000/api/intervenants");
      if (!response.ok) {
        throw new Error("Failed to fetch intervenants");
      }
      intervenants = await response.json();
      populateIntervenantOptions();
    } catch (error) {
      console.error("Error fetching intervenants:", error);
    }
  }

  async function fetchClients() {
    try {
      const response = await fetch("http://localhost:3000/api/clients");
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      clients = await response.json();
      populateClientOptions();
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  }

  function renderInterventions(interventionsToRender) {
    interventionTableBody.innerHTML = "";
    interventionsToRender.forEach((intervention) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${intervention.Id}</td>
                <td>${intervention.motive}</td>
                <td>${intervention.status}</td>
                <td>${intervention.intervenant.nom}</td>
                <td>${intervention.client.nom}</td>
                <td>${new Date(intervention.date).toLocaleDateString()}</td>
                <td>${intervention.type}</td>
                <td class="actions">
                    <i class="bx bx-edit-alt btn-edit" data-id="${
                      intervention.Id
                    }"></i>
                    <i class="bx bx-trash btn-remove" data-id="${
                      intervention.Id
                    }"></i>
                </td>
            `;
      interventionTableBody.appendChild(row);
    });

    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", handleEditIntervention);
    });
    document.querySelectorAll(".btn-remove").forEach((btn) => {
      btn.addEventListener("click", handleRemoveIntervention);
    });
  }

  function populateIntervenantOptions() {
    intervenantIdInterventionInput.innerHTML = "";
    intervenants.forEach((intervenant) => {
      const option = document.createElement("option");
      option.value = intervenant.id;
      option.textContent = `${intervenant.nom} ${intervenant.prenom}`;
      intervenantIdInterventionInput.appendChild(option);
    });
  }

  function populateClientOptions() {
    clientIdInterventionInput.innerHTML = "";
    clients.forEach((client) => {
      const option = document.createElement("option");
      option.value = client.id;
      option.textContent = `${client.nom} ${client.prenom}`;
      clientIdInterventionInput.appendChild(option);
    });
  }

  fetchInterventions();
  fetchIntervenants();
  fetchClients();

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredInterventions = interventions.filter(
      (intervention) =>
        intervention.motive.toLowerCase().includes(searchTerm) ||
        intervention.type.toLowerCase().includes(searchTerm) ||
        intervention.status.toLowerCase().includes(searchTerm)
    );
    renderInterventions(filteredInterventions);
  });

  addInterventionBtn.addEventListener("click", () => {
    console.log("clicked");

    openInterventionModal();
  });

  closeInterventionModal.addEventListener("click", () => {
    interventionModal.style.display = "none";
    resetForm();
  });

  window.addEventListener("click", (e) => {
    if (e.target === interventionModal) {
      interventionModal.style.display = "none";
      resetForm();
    }
  });

  interventionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const interventionData = {
      date: document.getElementById("dateInterventionInput").value,
      type: document.getElementById("typeInterventionInput").value,
      motive: document.getElementById("motiveInterventionInput").value,
      status: document.getElementById("statusInterventionInput").value,
      intervenantId: document.getElementById("intervenantIdInterventionInput")
        .value,
      clientId: document.getElementById("clientIdInterventionInput").value,
    };

    try {
      let response;
      if (editingInterventionId) {
        response = await fetch(
          `http://localhost:3000/api/interventions/${editingInterventionId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(interventionData),
          }
        );
      } else {
        response = await fetch("http://localhost:3000/api/interventions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(interventionData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save intervention");
      }

      await fetchInterventions();
      interventionModal.style.display = "none";
      resetForm();
    } catch (error) {
      console.error("Error saving intervention:", error);
    }
  });

  function handleEditIntervention(e) {
    const interventionId = Number.parseInt(e.target.getAttribute("data-id"));
    const intervention = interventions.find((i) => i.Id === interventionId);
    if (intervention) {
      editingInterventionId = interventionId;
      openInterventionModal(intervention);
    }
  }

  async function handleRemoveIntervention(e) {
    const interventionId = Number.parseInt(e.target.getAttribute("data-id"));

    // SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas annuler cette action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer!",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/interventions/${interventionId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete intervention");
        }

        await fetchInterventions(); // Refresh the intervention list
        Swal.fire("Supprimé!", "L'intervention a été supprimée.", "success");
      } catch (error) {
        console.error("Error deleting intervention:", error);
        Swal.fire(
          "Erreur!",
          "Une erreur s'est produite lors de la suppression.",
          "error"
        );
      }
    }
  }
  function openInterventionModal(intervention = null) {
    const statusField = document.getElementById("statusInterventionInput");

    if (intervention) {
      // Mode Modification
      modalInterventionTitle.textContent = "Modifier Intervention";
      submitInterventionBtn.textContent = "Mettre à jour";
      document.getElementById("dateInterventionInput").value =
        intervention.date.split("T")[0];
      document.getElementById("typeInterventionInput").value =
        intervention.type;
      document.getElementById("motiveInterventionInput").value =
        intervention.motive;
      document.getElementById("statusInterventionInput").value =
        intervention.status;
      document.getElementById("intervenantIdInterventionInput").value =
        intervention.intervenantId;
      document.getElementById("clientIdInterventionInput").value =
        intervention.clientId;

      // Afficher le statut lors de la modification
      statusField.style.display = "block";
    } else {
      // Mode Ajout
      modalInterventionTitle.textContent = "Ajouter une Intervention";
      submitInterventionBtn.textContent = "Ajouter";

      // Cacher le statut et le définir par défaut
      statusField.style.display = "none";
      statusField.value = "pending";
    }

    interventionModal.style.display = "flex";
  }
  console.log("opened");

  function resetForm() {
    interventionForm.reset();
    editingInterventionId = null;
  }

  // Export PDF functionality
  const exportPdfBtn = document.getElementById("exportPdfBtn");

  exportPdfBtn.addEventListener("click", () => {
    if (interventionsToExport.length === 0) {
      Swal.fire("Info", "No interventions to export!", "info");
      return;
    }

    const doc = new jspdf.jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Interventions List", 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(new Date().toLocaleDateString(), 14, 28);

    // Create table data
    const tableData = interventionsToExport.map((intervention) => [
      intervention.id,
      intervention.motive,
      intervention.status,
      intervention.intervenant.nom,
      intervention.client.nom,
      new Date(intervention.date).toLocaleDateString(),
      intervention.type,
    ]);

    // AutoTable configuration
    doc.autoTable({
      head: [
        ["ID", "Motif", "Statut", "Intervenant", "Client", "Date", "Type"],
      ],
      body: tableData,
      startY: 35,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 60 },
      },
    });

    // Save the PDF
    doc.save(`interventions_${new Date().toISOString().split("T")[0]}.pdf`);
  });
});
