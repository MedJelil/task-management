document.addEventListener("DOMContentLoaded", () => {
  const intervenantTableBody = document.getElementById("intervenantTableBody");
  const searchInput = document.getElementById("searchInput");
  const addIntervenantBtn = document.getElementById("addIntervenantBtn");
  const intervenantModal = document.getElementById("intervenantModal");
  const closeIntervenantModal = document.getElementById(
    "closeIntervenantModal"
  );
  const intervenantForm = document.getElementById("intervenantForm");
  const modalIntervenantTitle = document.getElementById(
    "modalIntervenantTitle"
  );
  const submitIntervenantBtn = document.getElementById("submitIntervenantBtn");

  let intervenants = [];
  let editingIntervenantId = null;

  async function fetchIntervenants() {
    try {
      const response = await fetch("http://localhost:3000/api/intervenants");
      if (!response.ok) {
        throw new Error("Failed to fetch intervenants");
      }
      intervenants = await response.json();
      renderIntervenants(intervenants);
    } catch (error) {
      console.error("Error fetching intervenants:", error);
    }
  }

  function renderIntervenants(intervenantsToRender) {
    intervenantTableBody.innerHTML = "";
    intervenantsToRender.forEach((intervenant) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${intervenant.id}</td>
                <td>${intervenant.nom}</td>
                <td>${intervenant.prenom}</td>
                <td>${intervenant.poste}</td>
                <td class="actions">
                    <i class="bx bx-edit-alt btn-edit" data-id="${intervenant.id}"></i>
                    <i class="bx bx-trash btn-remove" data-id="${intervenant.id}"></i>
                </td>
            `;
      intervenantTableBody.appendChild(row);
    });

    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", handleEditIntervenant);
    });
    document.querySelectorAll(".btn-remove").forEach((btn) => {
      btn.addEventListener("click", handleRemoveIntervenant);
    });
  }

  fetchIntervenants();

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredIntervenants = intervenants.filter(
      (intervenant) =>
        intervenant.nom.toLowerCase().includes(searchTerm) ||
        intervenant.prenom.toLowerCase().includes(searchTerm) ||
        intervenant.poste.toLowerCase().includes(searchTerm)
    );
    renderIntervenants(filteredIntervenants);
  });

  addIntervenantBtn.addEventListener("click", () => {
    openIntervenantModal();
  });

  closeIntervenantModal.addEventListener("click", () => {
    intervenantModal.style.display = "none";
    resetIntervenantForm();
  });

  window.addEventListener("click", (e) => {
    if (e.target === intervenantModal) {
      intervenantModal.style.display = "none";
      resetIntervenantForm();
    }
  });

  intervenantForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const intervenantData = {
      nom: document.getElementById("nomIntervenantInput").value,
      prenom: document.getElementById("prenomIntervenantInput").value,
      poste: document.getElementById("posteIntervenantInput").value,
    };

    try {
      let response;
      if (editingIntervenantId) {
        response = await fetch(
          `http://localhost:3000/api/intervenants/${editingIntervenantId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(intervenantData),
          }
        );
      } else {
        response = await fetch("http://localhost:3000/api/intervenants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(intervenantData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save intervenant");
      }

      await fetchIntervenants();
      intervenantModal.style.display = "none";
      resetIntervenantForm();
    } catch (error) {
      console.error("Error saving intervenant:", error);
    }
  });

  function handleEditIntervenant(e) {
    const intervenantId = Number.parseInt(e.target.getAttribute("data-id"));
    const intervenant = intervenants.find((i) => i.id === intervenantId);
    if (intervenant) {
      editingIntervenantId = intervenantId;
      openIntervenantModal(intervenant);
    }
  }

  async function handleRemoveIntervenant(e) {
    const intervenantId = Number.parseInt(e.target.getAttribute("data-id"));

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
          `http://localhost:3000/api/intervenants/${intervenantId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete intervenant");
        }

        await fetchIntervenants(); // Refresh the intervenant list
        Swal.fire("Supprimé!", "L'intervenant a été supprimé.", "success");
      } catch (error) {
        console.error("Error deleting intervenant:", error);
        Swal.fire(
          "Erreur!",
          "Une erreur s'est produite lors de la suppression.",
          "error"
        );
      }
    }
  }

  function openIntervenantModal(intervenant = null) {
    if (intervenant) {
      modalIntervenantTitle.textContent = "Modifier Intervenant";
      submitIntervenantBtn.textContent = "Mettre à jour";
      document.getElementById("nomIntervenantInput").value = intervenant.nom;
      document.getElementById("prenomIntervenantInput").value =
        intervenant.prenom;
      document.getElementById("posteIntervenantInput").value =
        intervenant.poste;
    } else {
      modalIntervenantTitle.textContent = "Ajouter un Intervenant";
      submitIntervenantBtn.textContent = "Ajouter";
    }
    intervenantModal.style.display = "flex";
  }

  function resetIntervenantForm() {
    intervenantForm.reset();
    editingIntervenantId = null;
  }

  // Export PDF functionality
  const exportPdfBtn = document.getElementById("exportPdfBtn");

  exportPdfBtn.addEventListener("click", () => {
    if (clientsToExport.length === 0) {
      Swal.fire("Info", "No clients to export!", "info");
      return;
    }

    const doc = new jspdf.jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Client List", 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(new Date().toLocaleDateString(), 14, 28);

    // Create table data
    const tableData = clientsToExport.map((client) => [
      client.id,
      client.nom,
      client.prenom,
      client.direction,
    ]);

    // AutoTable configuration
    doc.autoTable({
      head: [["ID", "Nom", "Prenom", "Direction"]],
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
    doc.save(`clients_${new Date().toISOString().split("T")[0]}.pdf`);
  });
});
