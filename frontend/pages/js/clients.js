// import * as lucide from "lucide";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  //   lucide.createIcons();

  const clientTableBody = document.getElementById("clientTableBody");
  const searchInput = document.getElementById("searchInput");
  const addClientBtn = document.getElementById("addClientBtn");
  const clientModal = document.getElementById("clientModal");
  const closeModal = document.getElementById("closeModal");
  const clientForm = document.getElementById("clientForm");
  const modalTitle = document.getElementById("modalTitle");
  const submitBtn = document.getElementById("submitBtn");

  let clients = [];
  let editingClientId = null;

  // Function to fetch all clients
  async function fetchClients() {
    try {
      const response = await fetch("http://localhost:3000/api/clients");
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      clients = await response.json();
      renderClients(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  }

  // Function to render clients
  function renderClients(clientsToRender) {
    clientTableBody.innerHTML = "";
    clientsToRender.forEach((client) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                  <td>${client.id}</td>
                  <td>${client.nom}</td>
                  <td>${client.prenom}</td>
                  <td>${client.direction}</td>
                  <td class="actions">
                   <i class="bx bx-edit-alt btn-edit" data-id="${client.id}"></i>
                   <i class="bx bx-trash btn-remove" data-id="${client.id}"></i>
                  </td>
              `;
      clientTableBody.appendChild(row);
    });

    // Add event listeners for edit and remove buttons
    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", handleEdit);
    });
    document.querySelectorAll(".btn-remove").forEach((btn) => {
      btn.addEventListener("click", handleRemove);
    });
  }

  // Initial fetch and render
  fetchClients();

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredClients = clients.filter(
      (client) =>
        client.nom.toLowerCase().includes(searchTerm) ||
        client.prenom.toLowerCase().includes(searchTerm) ||
        client.direction.toLowerCase().includes(searchTerm)
    );
    renderClients(filteredClients);
  });

  // Open modal for adding new client
  addClientBtn.addEventListener("click", () => {
    openModal();
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    clientModal.style.display = "none";
    resetForm();
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === clientModal) {
      clientModal.style.display = "none";
      resetForm();
    }
  });

  // Handle form submission (add or edit client)
  clientForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const clientData = {
      nom: document.getElementById("nomInput").value,
      prenom: document.getElementById("prenomInput").value,
      direction: document.getElementById("directionInput").value,
    };

    try {
      let response;
      if (editingClientId) {
        // Edit existing client
        response = await fetch(
          `http://localhost:3000/api/clients/${editingClientId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(clientData),
          }
        );
      } else {
        // Add new client
        response = await fetch("http://localhost:3000/api/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clientData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save client");
      }

      await fetchClients(); // Refresh the client list
      clientModal.style.display = "none";
      resetForm();
    } catch (error) {
      console.error("Error saving client:", error);
    }
  });

  // Handle edit button click
  function handleEdit(e) {
    const clientId = Number.parseInt(e.target.getAttribute("data-id"));
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      editingClientId = clientId;
      openModal(client);
    }
  }

  // Handle remove button click
  async function handleRemove(e) {
    const clientId = Number.parseInt(e.target.getAttribute("data-id"));

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
          `http://localhost:3000/api/clients/${clientId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete client");
        }

        await fetchClients(); // Refresh the client list
        Swal.fire("Supprimé!", "Le client a été supprimé.", "success");
      } catch (error) {
        console.error("Error deleting client:", error);
        Swal.fire(
          "Erreur!",
          "Une erreur s'est produite lors de la suppression.",
          "error"
        );
      }
    }
  }

  // Open modal for adding or editing
  function openModal(client = null) {
    if (client) {
      modalTitle.textContent = "Edit Client";
      submitBtn.textContent = "Update Client";
      document.getElementById("nomInput").value = client.nom;
      document.getElementById("prenomInput").value = client.prenom;
      document.getElementById("directionInput").value = client.direction;
    } else {
      modalTitle.textContent = "Add New Client";
      submitBtn.textContent = "Add Client";
    }
    clientModal.style.display = "flex";
  }

  // Reset form and editing state
  function resetForm() {
    clientForm.reset();
    editingClientId = null;
  }
});
